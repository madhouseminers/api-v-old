import db from "../../../db";

interface IListServerParams {
  category: string;
}

export default async (_: any, args: IListServerParams) => {
  let query =
    "select id, name, version, status, playercount, category from servers";
  let params = [];
  if (args.category) {
    query += " where category=$1";
    params.push(args.category.toUpperCase());
  }
  const result = await db.query(query, params);
  return result.rows;
};
