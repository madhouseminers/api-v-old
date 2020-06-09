import * as mcServerStatus from "mc-server-status";
import db from "../db";
import * as dns from "dns";
import { pubsub } from "../graphql/resolvers";

interface IServer {
  id: string;
  url: string;
  status: string;
  playercount: number;
}

interface IAddress {
  name: string;
  port: number;
}

async function fetchSrv(hostname: string): Promise<IAddress> {
  return new Promise((resolve, reject) => {
    dns.resolveSrv(`_minecraft._tcp.${hostname}`, (err, address) => {
      if (err) return reject(err);
      resolve(address[0]);
    });
  });
}

async function updateData(server: IServer) {
  const serverInfo = await fetchSrv(server.url);
  const status = await mcServerStatus.getStatus({
    host: serverInfo.name,
    port: serverInfo.port,
  });

  if (status.players.online === server.playercount) {
    return;
  }

  await db.query(
    "update servers set playerCount=$1, status='ONLINE' where id=$2",
    [status.players.online, server.id]
  );
  server.status = "ONLINE";
  server.playercount = status.players.online;

  await pubsub.publish("SERVER_UPDATED", { serverUpdated: server });
}

async function fetchServers() {
  const servers = await db.query(
    "select id, name, url, version, status, playercount, category from servers"
  );

  servers.rows.forEach((server) => updateData(server));
}

export default setInterval(fetchServers, 1000);
