import WebSocket from "ws";
import db from "../db";

const ws = new WebSocket("wss://chatshare.madhousehq.net:8080/ws");

interface IMessage {
  type: "MESSAGE";
  sender: string;
  name: string;
  message: string;
}

ws.on("message", (data) => {
  switch (data) {
    case "HELLO":
      ws.send(`Website::${process.env.CHATSHARE_PASSWORD}`);
      break;
    case "WELCOME":
      ws.send("VERSION::2.1");
      break;
    default:
      const message: IMessage = JSON.parse(data.toString());
      if (message.type === "MESSAGE") {
        db.query(
          "insert into chats (server, sender, sent, message) values ($1, $2, current_timestamp, $3)",
          [message.sender, message.name, message.message]
        );
      }
  }
});

export default ws;
