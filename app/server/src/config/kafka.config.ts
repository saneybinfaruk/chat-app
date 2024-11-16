import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  brokers: ["192.168.0.100:9092"],
  clientId: "hokage-hub",
  logLevel: logLevel.ERROR,
});

export default kafka;

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "hokage-hub",
  
});

export const connectKafkaProducer = async () => {
  await producer.connect();

  console.log("The Kafka producer connected...");
};


