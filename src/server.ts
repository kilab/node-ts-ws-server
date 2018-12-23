import http, { IncomingMessage, ServerResponse } from "http";
import { server as WebSocketServer } from "websocket";
import { serverStartTime, logger } from "./app";

// Create HTTP server
const httpServer = http.createServer(function (request: IncomingMessage, response: ServerResponse) {
  if (request.url === "/status") {
    response.writeHead(200, { "Content-Type": "application/json" });

    const responseObject = {
      serverStarted: serverStartTime,
    };

    response.end(JSON.stringify(responseObject));
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Sorry, unknown url");
  }
});

httpServer.listen(process.env.HTTP_PORT_LISTEN, (error: Error) => {
  if (error === undefined) {
    logger.info(`HTTP server started and listening on port ${process.env.HTTP_PORT_LISTEN}`);
  } else {
    process.exit(1);
  }
});

// Create WebSocket server
const wsServer = new WebSocketServer({
  httpServer: httpServer
});

// Handle WebSocket clients emits
wsServer.on("request", function (request) {
  const connection = request.accept(undefined, request.origin);

  connection.on("message", function (message) {

  });

  connection.on("close", function (connection) {

  });
});