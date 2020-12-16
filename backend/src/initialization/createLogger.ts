import winston from "winston";
import config from "../config";

export default () => {
  const transports = [];
  if (config.development) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.cli(),
          winston.format.splat()
        ),
      })
    );
  } else {
    transports.push(new winston.transports.Console());
  }

  return winston.createLogger({
    level: config.logLevel,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports,
  });
};
