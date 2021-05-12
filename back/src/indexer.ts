import path from 'path'
import AppSearchClient from '@elastic/app-search-node'
import config from 'config'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'
import Logger from 'pino'
import axios from 'axios'

const logger = Logger()

const {
  apiKey,
  baseUrlFn,
  engineName,
  baseUrl
} = config.get('appSearch')

const {
  baseDir,
  binary,
  maxConcurrentProcesses
} = config.get('git')

const client = new AppSearchClient(undefined, apiKey, baseUrlFn)

/**
 * Fetch README from git and index it
 * @param key model key
 */
export async function indexModelRepository(key: string) {
  // const options: Partial<SimpleGitOptions> = {
  //  baseDir: path.join(baseDir, key),
  //  binary,
  //  maxConcurrentProcesses,
  // }
  // const git: SimpleGit = simpleGit(options)
  // await git.init().addRemote('origin', `${baseUrl}/key`)
  // const readme = await git.fetch('origin', 'master').raw('pull', 'origin', 'master', '-- README.md')
  const { data } = await axios.get(`${baseUrl}/${key}/raw/main/README.md`)
  logger.debug(data)
  const document = {

  }
  await client.indexDocuments(engineName, [document])
}