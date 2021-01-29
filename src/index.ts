import * as http from "http";

http
  .createServer((_req, res) => {
    res.write("Hello, world");
    res.end();
  })
  .listen(process.env.PORT || 3000);
