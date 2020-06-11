import express from "express";
import { resolve } from "path";
const server = express();

// Health check
server.get("/", (req, res) => res.send("OK"));
server.use(express.static(resolve(__dirname, "../..", "dist")));

export default server;
