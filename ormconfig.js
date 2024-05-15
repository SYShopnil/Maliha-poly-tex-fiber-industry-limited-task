module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER_NAME || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["dist/modules/**/*.entity.js"],
  migrations: ["dis/modules/**/*.migration.js"],
  subscribers: ["dist/modules/**/*.subscribe.js"],
  cli: {
    entitiesDir: "./src/modules/**",
    migrationsDir: "./src/modules/**",
    subscribersDir: "./src/modules/**",
  },
};
