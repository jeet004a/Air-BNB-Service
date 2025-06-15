import { createLogger, format, transports } from 'winston';

export const userAcivityLogger = createLogger({
    level: 'info', // default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Console log
        new transports.File({ filename: 'logs/userActivity.log' }) // File log
    ],
});