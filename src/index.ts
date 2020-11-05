import dotenv from "dotenv";
dotenv.config();

const http = require("http");

import app from "./web";
import graphql from "./graphql";

graphql.applyMiddleware({ app });

const httpServer = http.createServer(app);
graphql.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT || 8080);

// import "./chatshare";
import "./minecraft";
