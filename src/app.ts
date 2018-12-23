import dotenv from "dotenv";
import winston from "winston";

// Application start datetime
export const serverStartTime: Date = new Date();

// Configure dotenv package to read .env files
dotenv.config();

// Create logger instance
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: process.env.APP_NAME }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});

// Catch Node.js exceptions and pass to logger
process.on("uncaughtException", (error: Error) => {
  logger.error(error.message + error.stack.split("\n")[2]);
});