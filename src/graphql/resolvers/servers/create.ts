import * as uuid from "uuid";
import db from "../../../db";

interface ICreateServerParams {
  name: string;
  version: string;
  category: "VANILLA" | "MODDED";
}

export default async (_: any, args: ICreateServerParams) => {
  const Server = {
    name: args.name,
    version: args.version,
    status: "UNKNOWN",
    playerCount: 0,
    category: args.category,
    id: uuid.v4(),
  };

  await db.query(
    "insert into servers (id, name, version, status, playerCount, category) values ($1, $2, $3, $4, $5, $6)",
    [
      Server.id,
      Server.name,
      Server.version,
      Server.status,
      Server.playerCount,
      Server.category,
    ]
  );

  return Server;
};
