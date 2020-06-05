import db from "../../../db";

interface IListChatParams {
  limit: number;
}

export default async (_: any, args: IListChatParams) => {
  let query =
    "select id, server, sender, sent, message from chats order by sent desc limit $1";
  const result = await db.query(query, [args.limit]);

  return result.rows.map((row) => {
    row.sent = row.sent.toISOString();
    return row;
  });
};
