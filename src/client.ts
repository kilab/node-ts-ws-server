import { client as WebSocketClient, IMessage } from "websocket";
import { serverStartTime, logger } from "./app";

const wsClient = new WebSocketClient();

wsClient.on("connectFailed", (error: Error) => {
  logger.error("Client connection failed: " + error.message);
});

wsClient.on("connect", (connection) => {
  logger.info(`Client connected to: ${connection.remoteAddress}`);

  connection.on("error", (error: Error) => {
    logger.error("Connection Error: " + error.message);
  });

  connection.on("close", () => {
    logger.info("Client connection closed");
  });

  connection.on("message", (message: IMessage) => {
    if (message.type === "utf8") {
      logger.info(`Received Message: ${message.utf8Data}`);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === "binary") {
      logger.info(`Received Binary Message of ${message.binaryData.length} bytes`);
      connection.sendBytes(message.binaryData);
    }
  });

  // send message to server
  connection.sendUTF("Hello my lord!");
});

wsClient.connect(`ws://localhost:${process.env.HTTP_PORT_LISTEN}/`, undefined);
