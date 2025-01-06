import { createLogger, format, transports } from 'winston';
import path from 'path';

// Define log format
const logFormat = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Create the logger instance
const logger = createLogger({
    level: 'info', // Minimum log level to log
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // Include stack traces for errors
        format.splat(),
        format.json(),
        logFormat
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: path.join('logs', 'combined.log') }), // Log to file
        new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }) // Separate error log
    ]
});

export default logger;
