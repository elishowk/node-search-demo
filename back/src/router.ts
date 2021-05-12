import { Context, Next } from 'koa'
import Router from 'koa-router'
import config from 'config'
import { indexModelRepository } from './indexer'

const BASE_URL: string = config.get('baseUrl')
const APP_NAME: string = config.get('appName')

export const router = new Router()

/**
 * Classic endpoint for Monitoring UP/DOWN
 */
router.get(`${BASE_URL}/health`, async (ctx: Context, next: Next) => {
  ctx.status = 200
  ctx.body = { service: APP_NAME, status: 'running' }
  return next()
})

/**
 * Webhook to trigger indexation of a repository
 */
router.post(`${BASE_URL}/index`, async (ctx: Context, next: Next) => {
  ctx.status = 200
  const { modelId } = ctx.request.body
  await indexModelRepository(modelId)
  ctx.body = { modelId, status: 'ok' }
  return next()
})