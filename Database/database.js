const mssql = require("mssql");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DATABASE_DATABASE,
//   process.env.DATABASE_USER,
//   process.env.DATABASE_PASSWORD,
//   {
//     host: process.env.DATABASE_SERVER,
//     dialect: "mssql",
//     port: parseInt(process.env.DATABASE_PORT),
//     dialectOptions: {
//       encrypt: false, // Use encryption
//       trustServerCertificate: true, // Change to false if you have a valid certificate
//     },
//   }
// );

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// module.exports = db;

// Configure database connection
const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_IP,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT),
  options: {
    encrypt: false, // Use encryption
    trustServerCertificate: true, // Change to false if you have a valid certificate
  },
};

async function connect() {
  try {
    const pool = await mssql.connect(config);
    console.log("Connected to SQL Server database");
    return pool;
  } catch (err) {
    console.error("Error connecting to SQL Server database:", err);
    throw err; // Re-throw the error for handling in the main server file
  }
}

module.exports = { connect };
