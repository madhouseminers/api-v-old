import { Pool } from "pg";

export async function up(db: Pool) {
  const query = `CREATE TABLE servers (
    id SERIAL,
    name varchar(50),
    url varchar(100),
    version varchar(10),
    playerCount int,
    status varchar(15),
    category varchar(20),
    PRIMARY KEY (id)
  )`;
  await db.query(query);

  await db.query(
    "insert into servers (name, url, version, playerCount, status, category) values ('RLCraft', 'rlcraft.madhouseminers.com', '2.81', 0, 'ONLINE', 'MODDED')"
  );
}

export async function down(db: Pool) {
  const query = `drop table servers`;
  await db.query(query);
}
