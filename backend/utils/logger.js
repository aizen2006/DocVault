/**
 * Simple logger utility for the application.
 * In production, this can be replaced with winston/pino for more advanced features.
 */

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

const currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

const formatMessage = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

const logger = {
    error: (message, meta = {}) => {
        if (currentLevel >= LOG_LEVELS.ERROR) {
            console.error(formatMessage('ERROR', message, meta));
        }
    },

    warn: (message, meta = {}) => {
        if (currentLevel >= LOG_LEVELS.WARN) {
            console.warn(formatMessage('WARN', message, meta));
        }
    },

    info: (message, meta = {}) => {
        if (currentLevel >= LOG_LEVELS.INFO) {
            console.log(formatMessage('INFO', message, meta));
        }
    },

    debug: (message, meta = {}) => {
        if (currentLevel >= LOG_LEVELS.DEBUG) {
            console.log(formatMessage('DEBUG', message, meta));
        }
    },

    // Log HTTP request (for middleware use)
    http: (req, res, duration) => {
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
        if (res.statusCode >= 400) {
            logger.warn(message, { ip: req.ip });
        } else {
            logger.info(message);
        }
    }
};

export default logger;
