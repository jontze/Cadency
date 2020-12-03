import winston, { LoggerOptions, format } from 'winston'

const options: LoggerOptions = {
  format: format.combine(
    format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
    format.printf(
      msg => `[${new Date().toLocaleString()}] [${msg.level}]: ${msg.message}`
    )
  ),
  transports: [
    new winston.transports.Console({ level: 'debug', format: format.combine(format.colorize({ all: true })) }),
    new winston.transports.File({ filename: 'bot.log', maxFiles: 5, maxsize: 5242880, level: 'info' })
  ]
}

const logger = winston.createLogger(options)

export default logger
