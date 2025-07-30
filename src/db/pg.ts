import { Pool, PoolClient } from "pg";

const pgConfig = {
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DATABASE || "my-database",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: parseInt(process.env.POSTGRES_PORT || "") || 5432,
};

const pool = new Pool(pgConfig);

async function connectToDB() {
  try {
    const client: PoolClient = await pool.connect();
    console.log(`Connected to PostgreSQL DB successfully`);
    client.release();
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`DATABASE_CONNECTION_ERROR: `, err.stack);
    }
    return false;
  }
}

export { pool, connectToDB };
