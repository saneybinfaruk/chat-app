import { Chat } from "@/app/interfaces/interfaces";
import mongoose from "mongoose";
import ChatModel from "../models/chat-model";
import MessageModel from "../models/message-model";

// export const allGroupChats = async (userId?: string) => {
//   try {
//     // if (!userId) throw new Error("User ID is required");

//     const chats = await ChatModel.find({
//       groupChat: true,
//       $or: [
//         { createdBy: userId },        // Groups the user created
//         { members: userId },           // Groups the user is a member of
//       ],
//     }).populate("members", "fullName email avatarUrl");

//     return chats;
//   } catch (error) {
//     console.error("Error fetching group chats:", error);
//     return [];
//   }
// };
export const allGroupChats = async (userId: string) => {
  try {
    const id = new mongoose.Types.ObjectId(userId);

    // Fetch chats where the user is a member and it's not a group chat
    const chats = await ChatModel.find({
      groupChat: true,
      $or: [{ createdBy: userId }, { members: { $in: [id] } }],
    }).populate("members", "fullName email avatarUrl");

    // Iterate through chats and fetch members other than the user, and last message
    const chatMember = await Promise.all(

      chats.map(async (chat) => {

        const filteredMembers = chat.members.filter(
          (member: any) => member._id.toString() !== id.toString()
        );

        // Fetch the last message for the chat
        const lastMessage = await MessageModel.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 }) // Sort messages by creation date in descending order
          .select("content createdAt sender") // Select the relevant fields
          .populate("sender", "fullName email"); // Populate the sender's info

        const unreadMessageCount = await MessageModel.countDocuments({
          chatId: chat._id,
          isRead: false,
          readBy: { $ne: id },
        });

        return {
          groupName: chat.groupName,
          id: chat._id.toString(),
          members: filteredMembers.map((f: any) => {
            return {
              id: f._id.toString(),
              fullName: f.fullName,
              email: f.email,
              avatarUrl: f.avatarUrl,
            };
          }), // Only members other than createdBy
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                sender: {
                  id: lastMessage.sender._id.toString(),
                  fullName: lastMessage.sender.fullName,
                  email: lastMessage.sender.email,
                },
              }
            : null, // If there is no last message

          unreadMessages: unreadMessageCount,
        };
      })
    );

    return chatMember;
  } catch (error) {
    console.error("Error fetching private chats:", error);
  }
};

// export const allPrivateChats = async (userId: string) => {
//   try {
//     const id = new mongoose.Types.ObjectId(userId);
//     const chats = await ChatModel.find({
//       groupChat: false,
//       members: { $in: [id] },
//     }).populate("members", "fullName email avatarUrl");

//     // Iterate through chats and filter members other than user
//     const chatMember = chats.map( (chat) => {
//       const filteredMembers = chat.members.filter(
//         (member: any) => member._id.toString() !== id.toString()
//       );

//       return {
//         id: chat._id.toString(),
//         members: filteredMembers.map((f: any) => {
//           return {
//             id: f._id.toString(),
//             fullName: f.fullName,
//             email: f.email,
//             avatarUrl: f.avatarUrl,
//           };
//         }), // Only members other than createdBy
//       };
//     });

//     return chatMember;
//   } catch (error) {
//     console.error("Error fetching private chats:", error);
//   }
// };

export const allPrivateChats = async (userId: string) => {
  try {
    const id = new mongoose.Types.ObjectId(userId);

    // Fetch chats where the user is a member and it's not a group chat
    const chats = await ChatModel.find({
      groupChat: false,
      members: { $in: [id] },
    }).populate("members", "fullName email avatarUrl");

    // Iterate through chats and fetch members other than the user, and last message
    const chatMember = await Promise.all(
      chats.map(async (chat) => {
        const filteredMembers = chat.members.filter(
          (member: any) => member._id.toString() !== id.toString()
        );

        // Fetch the last message for the chat
        const lastMessage = await MessageModel.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 }) // Sort messages by creation date in descending order
          .select("content createdAt sender") // Select the relevant fields
          .populate("sender", "fullName email"); // Populate the sender's info

        const unreadMessageCount = await MessageModel.countDocuments({
          chatId: chat._id,
          isRead: false,
          readBy: { $ne: id },
        });

        return {
          id: chat._id.toString(),
          members: filteredMembers.map((f: any) => {
            return {
              id: f._id.toString(),
              fullName: f.fullName,
              email: f.email,
              avatarUrl: f.avatarUrl,
            };
          }), // Only members other than createdBy
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                sender: {
                  id: lastMessage.sender._id.toString(),
                  fullName: lastMessage.sender.fullName,
                  email: lastMessage.sender.email,
                },
              }
            : null, // If there is no last message

          unreadMessages: unreadMessageCount,
        };
      })
    );

    return chatMember;
  } catch (error) {
    console.error("Error fetching private chats:", error);
  }
};

export const createChat = async (chat: Chat) => {
  try {
    const existingChat = await ChatModel.findOne({
      groupChat: false,
      members: { $all: [chat.members[0], chat.members[1]], $size: 2 },
    });

    if (existingChat) {
      console.log("Chat already exists: ", existingChat);
      return existingChat._id.toString(); // Return existing chat if found
    }
    const newChat = await ChatModel.create(chat);
    console.log("newChat ", newChat);
    return newChat._id.toString();
  } catch (error) {
    console.log(error);
  }
};

export const chatById = async (chatId: string) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
  }).populate("members", "_id fullName email avatarUrl");

  return chat;
};
