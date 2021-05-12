require('dotenv').config({ path: `/secrets/.env` })
import { Promise } from 'bluebird'
import axios from 'axios'
import Koa from 'koa'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import config from 'config'
import Logger from 'pino'
import { applySecurityMiddlewares } from './security'
import { router } from './router'
import { IModel } from './interfaces'
import { indexModelRepository } from './indexer'

const logger = Logger()

const PORT: number = config.get('port')
const CONCURRENCY = 20
const modelsUrl: string = config.get('modelsUrl')

const app = new Koa()

// Trust headers coming from proxies
// We need it to have secure cookies
if (process.env.NODE_ENV !== 'development') {
  app.proxy = true
}

app.use(json())
app.use(bodyParser())

applySecurityMiddlewares(app)

/**
 * Routes are hooks to manualy push indexation for a given repository
 * This could be used with a Git repository watcher that request this webhook server
 */
app.use(router.routes())

/**
 * Server loops over the models to keep index up-to-date
 */
app.listen({ port: PORT }, async () => {
  logger.info(`NODE_ENV = ${process.env.NODE_ENV}`)
  logger.info(`Daemon & Webhooks are ready to rumble !`)

  const waitFor = (ms: number) => new Promise((res: any) => setTimeout(res, ms))
  // scan git repos and post new async functions
  while (true) {
    logger.info(`starting scanning git repositories from ${modelsUrl}`)
    
    const { data } = await axios.get(modelsUrl)
    logger.debug(data)

    // in production, use an Async Job queue or Serverless functions to scale
    await Promise.map(data, async (item: IModel) => {
      await indexModelRepository(item.key)
    }, { concurrency: CONCURRENCY })

    logger.info(`finished scanning git repositories...`)
    await waitFor(2000)
  }
})
