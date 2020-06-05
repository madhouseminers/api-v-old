import dotenv from "dotenv";
dotenv.config();

import app from "./web";
import graphql from "./graphql";

graphql.applyMiddleware({ app });
app.listen(8080);

// import "./chatshare";
