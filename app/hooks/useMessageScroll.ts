import { useEffect, useRef } from "react";
import { Message } from "../interfaces/interfaces";

const useMessageScroll = (messages: Message[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  return { messagesEndRef };
};
export default useMessageScroll;
