import * as http from "node:http";

const PORT = process.env.PORT || 8000;

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

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
