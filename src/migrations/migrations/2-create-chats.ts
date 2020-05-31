import { Pool } from "pg";

export async function up(db: Pool) {
  const query = `CREATE TABLE chats (
    id SERIAL,
    server varchar(50),
    sender varchar(50),
    sent timestamp,
    message text,
    PRIMARY KEY (id)
  )`;
  await db.query(query);
}

export async function down(db: Pool) {
  const query = `DROP TABLE chats`;
  await db.query(query);
}
