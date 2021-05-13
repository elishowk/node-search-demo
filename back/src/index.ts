// Useful when using distributed secret vaults that injects environment variable accros your cluster
require('dotenv').config()

import { Promise } from 'bluebird'
import axios from 'axios'
import Koa from 'koa'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import config from 'config'
import Logger from 'pino'
import waitPort from 'wait-port'

import { applySecurityMiddlewares } from './security'
import { router } from './router'
import { IModel } from './interfaces'
import { indexModelRepository } from './indexer'

const logger = Logger()

const PORT: number = config.get('port')
const CONCURRENCY = 200
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
  logger.info(`NODE_ENV = ${config.get('env')}`)
  logger.info(`Daemon & Webhooks are ready to rumble !`)
  const { baseUrlFn } = config.get('appSearch')
  const waitFor = (ms: number) => new Promise((res: any) => setTimeout(res, ms))
  // scan git repos and post new async functions
  while (true) {
    logger.info(`starting scanning git repositories from ${modelsUrl}`)
    
    const { data } = await axios.get(modelsUrl)
    const waitForUrl = new URL(baseUrlFn())
    await waitPort({
      host: waitForUrl.hostname,
      port: Number(waitForUrl.port),
    })
    // Fixed concurrency for to demo how to avoid too much requests
    await Promise.map(data, async (item: IModel) => {
      await indexModelRepository(item.modelId, {
        pipeline_tag: item.pipeline_tag,
        private: item.private,
        key: item.key,
      })
    }, { concurrency: CONCURRENCY })

    logger.info(`finished scanning git repositories...`)
    await waitFor(5000)
  }
})
