import { useEffect, useState } from "react";
import { Chat } from "../interfaces/interfaces";

const useChatInfo = (chatId: string) => {
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const response = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({ chatId }),
      });

      const { chat } = await response.json();

      setChatInfo(chat);
    };

    fetchChatInfo();
  }, []);

  return { chatInfo };
};
export default useChatInfo;
