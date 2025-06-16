import { logger } from './logger'

/**
 * Retries a function with exponential backoff
 *
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries before giving up
 * @param initialDelay Initial delay in milliseconds
 * @param backoffFactor Factor to multiply delay by after each retry
 * @returns The result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  initialDelay = 1000,
  backoffFactor = 2,
): Promise<T> {
  let retries = 0
  let delay = initialDelay

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn()
    } catch (error) {
      console.log('error', error)

      retries++

      if (retries > maxRetries) {
        logger.error({ error, retries }, 'Max retries reached, giving up')
        throw error
      }

      logger.warn({ error, retries, delay }, `Error in function, retrying in ${delay}ms`)

      await new Promise((resolve) => setTimeout(resolve, delay))
      delay = Math.min(delay * backoffFactor, 30000) // Max delay of 30 seconds
    }
  }
}
