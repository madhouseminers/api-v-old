import * as pg from "pg";
const pool = new pg.Pool({
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
