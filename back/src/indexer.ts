import AppSearchClient from '@elastic/app-search-node'
import config from 'config'
import Logger from 'pino'
import axios from 'axios'
import remark from 'remark'
import strip from 'strip-markdown'

import { IModelMetadata } from './interfaces'

const logger = Logger()
const { repoUrl } = config.get('git')

/**
 * Configure Elastic App search client
 */
const {
  apiKey,
  baseUrlFn,
  engineName,
} = config.get('appSearch')

const apiUrl = new URL('/api/as/v1/', baseUrlFn()).href

/**
 * Utility function to strip markdown markup
 * @param data markdown string
 * @returns 
 */
function stripMarkdown(data: string): string {
  let result: string
  remark().use(strip).process(data, (err: any, file: any) => {
    if (err) {
      return
    }
    result = String(file)
  })
  return result
}

/**
 * Fetch README and index it
 * @param id model key
 */
export async function indexModelRepository(id: string, metadata: IModelMetadata = {}) {
  // Fetch Readme
  const readMeUrl = new URL(`${id}/raw/main/README.md`, repoUrl).href
  let response
  try {
    response = await axios.get(readMeUrl)
  } catch (err) {
    //logger.error(`${err.message} ${err.config?.url}`)
  }

  if (!response) {
    return
  }
  // Process data
  const { data } = response
  let body = data
  try {
    body = stripMarkdown(data)
  } catch(err) {
    logger.error(`Unable to strip markdown for ${id}, defaulting to raw markdown`)
  }
  // Index data
  const client = new AppSearchClient(undefined, apiKey, () => apiUrl)
  const document = {
    ...metadata,
    id,
    title: id,
    nps_link: `${repoUrl}/${id}`,
    body,
  }
  await client.indexDocuments(engineName, [document])
}