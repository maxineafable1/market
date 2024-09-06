import { Pool } from 'pg'

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DB
})