import { Pool } from "pg";

export async function up(db: Pool) {
  const query = `CREATE TABLE servers (
    id char(36),
    name varchar(50),
    version varchar(10),
    playerCount int,
    status varchar(15),
    category varchar(20),
    PRIMARY KEY (id)
  )`;
  await db.query(query);
}

export async function down(db: Pool) {
  const query = `drop table servers`;
  await db.query(query);
}
