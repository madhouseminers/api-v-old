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
  let status;
  const serverInfo = await fetchSrv(server.url);
  try {
    status = await mcServerStatus.getStatus({
      host: serverInfo.name,
      port: serverInfo.port,
    });
  } catch (e) {
    await db.query(
      "update servers set playerCount=0, status='OFFLINE' where id=$1",
      [server.id]
    );
    return;
  }

  if (status.players.online === server.playercount && server.status === 'ONLINE') {
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

  for (let i = 0; i<servers.rowCount; i++) {
    try {
      await updateData(servers.rows[i]);
    } catch (e) {
      console.log(`${servers.rows[i].name} : ${e.message}`)
    }
  }
}

export default setInterval(fetchServers, 10000);
