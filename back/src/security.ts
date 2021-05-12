import Koa, { Context, Next } from 'koa'
import cors, { Options } from '@koa/cors'
import helmet from 'koa-helmet'
import Logger from 'pino'
import config from 'config'

const logger = Logger()

const CORS_CONFIG: Options = config.get('cors')
const firewallHosts: string = config.get('firewallAuthorizedHosts')
const FIREWALL_AUTHORIZED_HOSTS = firewallHosts.split(',')

/**
 * Firewall middleware
 */
function firewallMiddleware(ctx: Context, next: Next) {
  const requestedHost = ctx.headers.host

  const authorize = FIREWALL_AUTHORIZED_HOSTS.some((authorizedHostname: string) =>
    new RegExp(authorizedHostname).test(requestedHost),
  )

  if (!authorize) {
    logger.info('constellation-api firewall has closed the connection', { requestedHost })
    return ctx.res.end()
  }
  return next()
}

export function applySecurityMiddlewares(app: Koa) {
  app.use(helmet())
  app.use(firewallMiddleware)

  app.use(cors(CORS_CONFIG))
}
