const mysql = require("mysql");

const db = mysql.createConnection({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});

module.exports = db;
