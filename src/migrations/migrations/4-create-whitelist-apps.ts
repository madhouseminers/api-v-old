import { Pool } from "pg";

export async function up(db: Pool) {
  const query = `CREATE TABLE whitelists (
    id SERIAL,
    user_id int,
    reviewer_id int,
    reviewer_feedback text,
    status varchar(30),
    
    submitted timestamptz,
    reviewed timestamptz,
    
    where_heard text,
    modded_experience text,
    known_members text,
    interested_servers text,
    about_user text,
    
    PRIMARY KEY (id)
  )`;
  await db.query(query);
}

export async function down(db: Pool) {
  const query = `DROP TABLE whitelists`;
  await db.query(query);
}
