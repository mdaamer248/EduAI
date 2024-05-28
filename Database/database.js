import pkg from "mssql";
import "dotenv/config";
const { connect: _connect } = pkg;

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
    const pool = await _connect(config);
    console.log("Connected to SQL Server database");
    return pool;
  } catch (err) {
    console.error("Error connecting to SQL Server database:", err);
    throw err; // Re-throw the error for handling in the main server file
  }
}

export const dbConnect = connect;
