import mongoose from "mongoose";
import MessageModel from "../models/message-model";
import { Message } from "@/app/interfaces/interfaces";
import { chatById } from "./chat";
import { authOption } from "@/app/auth/components/AuthOption";
import { getServerSession } from "next-auth";

export const createMessage = async (
  messageId: string,
  chatId: mongoose.Types.ObjectId,
  content: string,
  sender: mongoose.Types.ObjectId,
  attachments?: { publicId: string; url: string }[]
) => {
  const message = await MessageModel.create({
    messageId,
    chatId,
    content,
    sender,
    attachments,
    readBy: [],
  });

  return message.populate("sender", "_id fullName avatarUrl");
};

export const messagesByChatId = async (chatId: string) => {
  const chat = await chatById(chatId);

  const session = await getServerSession(authOption);

  const member = chat.members.filter(
    (m: any) => m._id.toString() !== session?.user.id
  );

  const messages = await MessageModel.find({ chatId })
    .sort({ createdAt: 1 })
    .populate("readBy", "_id fullName avatarUrl")
    .populate("sender", "_id fullName avatarUrl");

  // console.log("messages ==> ", messages);

  return { messages, member };
};

export const updateSingleMessageAsRead = async (
  chatId: string,
  messageId: string,
  userId: string
) => {
  try {
    const result = await MessageModel.updateOne(
      {
        chatId,
        messageId,
        
      },
      {
        $set: {
          isRead: true,
        },
        $addToSet: {
          readBy: userId,
        },
      }
    );
    return result.modifiedCount;
  } catch (error) {
    console.error("Error marking messages as read: ", error);
  }
};

export const updateMessagesAsRead = async (chatId: string, userId: string) => {
  try {
    const result = await MessageModel.updateMany(
      {
        chatId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
        $addToSet: {
          readBy: userId,
        },
      }
    );

    return result.modifiedCount;
  } catch (error) {
    console.error("Error marking messages as read: ", error);
  }
};
