import pino from 'pino'

/**
 * Shared logger instance for consistent logging across the application
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  messageKey: 'message',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      messageKey: 'message',
      singleLine: false,
    },
  },
  base: {},
})

/**gp
 * Creates a child logger with additional context
 */
export function createChildLogger(context: Record<string, unknown>) {
  return logger.child(context)
}
