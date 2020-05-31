import express from "express";
const server = express();

// Health check
server.get("/", (req, res) => res.send("OK"));

export default server;
