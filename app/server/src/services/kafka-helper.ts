import { consumer, producer } from "../config/kafka.config";

export const produceMessage = async (topic: string, data: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    // console.log(`Message produced to topic ${topic}:`, data);
  } catch (error) {
    console.error(`Error producing message to topic ${topic}:`, error);
  }
};

export const consumeMessages = async (topic: string) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const parsedData = JSON.parse(message.value?.toString()!);
        
        try {
          const response = await fetch(
            `http://localhost:3000/api/messages/${parsedData.chatId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" }, // Specify content type
              body: JSON.stringify(parsedData),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("API Response: Message Saved to database! ", result.success);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error(`Error consuming messages from topic ${topic}:`, error);
  }
};
