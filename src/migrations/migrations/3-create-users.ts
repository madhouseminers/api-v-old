import { Pool } from "pg";

export async function up(db: Pool) {
  const query = `CREATE TABLE users (
    id SERIAL,
    email varchar(50),
    password varchar(255),
    display varchar(50),
    minecraftuuid varchar(50),
    dob date,
    reviewer boolean default false,
    register_key varchar(16),
    reset_key varchar(16),
    PRIMARY KEY (id)
  )`;
  await db.query(query);
}

export async function down(db: Pool) {
  const query = `DROP TABLE users`;
  await db.query(query);
}
