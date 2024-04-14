import { default as Pino } from 'pino';

const LOGGER_APP_NAME = process.env.LOGGER_APP_NAME || 'space-ship-adventure'
const LOGGER_LOGGING_LEVEL = process.env.LOGGER_LOGGING_LEVEL || 'info'

export const configureLogger = () => {
    const logger = Pino({
        name: LOGGER_APP_NAME,
    });
    logger.info(`Logger configured for: ${LOGGER_APP_NAME}, on level: ${LOGGER_LOGGING_LEVEL}`)
    return logger;
}