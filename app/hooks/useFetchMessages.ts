import { useEffect, useState } from "react";
import { Message } from "../interfaces/interfaces";

const useFetchMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<
    {
      _id: string;
      fullName: string;
      avatarUrl: string;
    }[]
  >();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/messages/${chatId}`);
        
        const { messages } = await response.json();

        setMembers(messages.member);
        setMessages(messages.messages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };
    fetchMessage();
  }, [chatId]);

  return { messages, setMessages, members, loading };
};

export default useFetchMessages;
