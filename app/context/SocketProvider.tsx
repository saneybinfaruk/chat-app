"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { USER_REGISTER } from "../constants/events";
import { useSession } from "next-auth/react";

interface ISocketContext {
  socket: Socket | null;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

const SocketContext = createContext<ISocketContext | null>(null);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return; // Ensure that the user is logged in

    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Socket connected: ", newSocket.id);

      // Emit user registration event after socket is connected
      newSocket.emit(USER_REGISTER, { userId });
    });

  
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up the socket on component unmount
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to access socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

export default SocketProvider;
