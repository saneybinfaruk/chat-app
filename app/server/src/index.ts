import { createServer } from "http";
import SocketService from "./services/socket";
import { connectKafkaProducer } from "./config/kafka.config";
import { consumeMessages } from "./services/kafka-helper";
import { INCOMMING_MESSAGE } from "./constants/events";

const socketService = new SocketService();

const httpServer = createServer();

const PORT = process.env.PORT ? process.env.PORT : 8000;

socketService.io.attach(httpServer);

connectKafkaProducer().catch((error) =>
  console.log("The Kafka connect error ", error)
);

consumeMessages(INCOMMING_MESSAGE).catch((error) => {
  console.log("The Kafka Consume Message error ", error);
});

httpServer.listen(PORT, () => {
  console.log("HTTP server listing ar port " + PORT);
});

socketService.initListeners();
