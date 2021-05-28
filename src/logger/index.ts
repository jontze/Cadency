import { config } from "dotenv";
import winston from "winston";
config();

const colors = {
  error: "red",
  warn: "orange",
  info: "green",
  http: "magenta",
  debug: "yellow",
};
winston.addColors(colors);

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const getLogLevel = () => {
  if (process.env.NODE_ENV !== "production") {
    return "debug";
  }
  return "info";
};

const timestampFormat = winston.format.timestamp({
  format: "DD.MM.YYYY HH:mm:ss",
});
const printFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    if (stack) {
      return `[${timestamp}] [${level}]: ${message} - ${stack}`;
    }
    return `[${timestamp}] [${level}]: ${message}`;
  }
);
const errorFormat = winston.format.errors({ stack: true });
const consoleFormat = winston.format.combine(
  timestampFormat,
  printFormat,
  errorFormat,
  winston.format.colorize({ all: true })
);
const fileFormat = winston.format.combine(
  timestampFormat,
  errorFormat,
  printFormat
);

const transports = [
  new winston.transports.Console({
    level: getLogLevel(),
    format: consoleFormat,
  }),
  new winston.transports.File({
    format: fileFormat,
    filename: "logs/error.log",
    level: "error",
    maxFiles: 5,
    maxsize: 5242880,
  }),
  new winston.transports.File({
    level: getLogLevel(),
    format: fileFormat,
    filename: "logs/combined.log",
    maxFiles: 5,
    maxsize: 5242880,
  }),
];

const logger = winston.createLogger({
  level: getLogLevel(),
  levels,
  transports,
});

export default logger;
