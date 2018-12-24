import http, { IncomingMessage, ServerResponse } from "http";
import { server as WebSocketServer, routerRequest, IMessage } from "websocket";
import { serverStartTime, logger } from "./app";

// Create HTTP server
const httpServer = http.createServer((request: IncomingMessage, response: ServerResponse) => {
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
wsServer.on("request", (request: routerRequest) => {
  const connection = request.accept(request.origin);

  connection.on("message", (message: IMessage) => {
    if (message.type === "utf8") {
      logger.info(`Received Message: ${message.utf8Data}`);
      // connection.sendUTF(message.utf8Data); // reply message to client
    }
    else if (message.type === "binary") {
      logger.info(`Received Binary Message of ${message.binaryData.length} bytes`);
      // connection.sendBytes(message.binaryData); // reply message to client
    }
  });

  connection.on("close", (code: number, message: string) => {
    logger.info(`Client disconnected. Reason: ${message}`);
  });
});