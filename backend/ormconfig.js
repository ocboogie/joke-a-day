require("dotenv").config();

module.exports = {
  type: "postgres",
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  host: process.env.DATABASE_HOST,
  logger: "advanced-console",
  logging: "all",
  migrations: ["migrations/*.ts"],
  cache: true,
  cli: {
    migrationsDir: "migrations"
  }
};
