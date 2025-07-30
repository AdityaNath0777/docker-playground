import * as http from "node:http";
import { connectToDB } from "./db/pg";
import * as userController from "./controllers/user.controller";

const PORT = process.env.PORT || 8000;

connectToDB().then((success) => {
  if (success) {
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  } else {
    console.error("Failed to connect to the database. Server will not start.");
    process.exit(1);
  }
});

const server: http.Server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    if (req.url === "/") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message:
            "Raam raam bhai from TS-Node server within the container in docker",
        })
      );
    } else if (req.url === "/namaste") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Namaste from TS-Node server within the container in docker",
        })
      );
    } else if (req.url === "/users" && req.method === "GET") {
      userController.getUsers(req, res);
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "My child, are you lost somewhere?",
        })
      );
    }
  }
);
