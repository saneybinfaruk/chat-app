import { log } from "console";
import UserModel from "../models/user-model";
import { SignUpField } from "@/app/zod/schemas";
import { User } from "@/app/interfaces/interfaces";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/auth/components/AuthOption";
import FriendShipModel from "../models/friendship-model";
import { io } from "socket.io-client"; // Import the Socket.io client
import { FRIEND_REQUEST } from "@/app/constants/events";
const socketServerUrl = "http://localhost:8000";

export const createUser = async (user: SignUpField) => {
  try {
    const newUser = await UserModel.create(user);
    console.log(newUser);
  } catch (error: any) {
    console.log(error);

    throw new Error(error);
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = (await UserModel.findOne({ email })) as User;
    return user;
  } catch (error) {}
};

export const findAllUser = async (name?: string, limit?: number) => {
  try {
    const session = await getServerSession(authOption);
    const userId = session?.user.id;
    const query: any = {};

    // If name is provided, add regex for fullName search
    if (name) {
      query.fullName = { $regex: name, $options: "i" };
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query._id = { $ne: new mongoose.Types.ObjectId(userId) };
    }

    // If limit is provided, apply limit to the query
    const users = (await UserModel.find(query).limit(limit ?? 0)) as User[];

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to find users");
  }
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const request = await FriendShipModel.findOne({
    $or: [
      {
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(receiverId),
      },
      {
        sender: new mongoose.Types.ObjectId(receiverId),
        receiver: new mongoose.Types.ObjectId(senderId),
      },
    ],
  });

  if (request) return { message: "Request already sent!" };

  await FriendShipModel.create({
    sender: senderId,
    receiver: receiverId,
  });

  const socket = io(socketServerUrl);
  socket.emit("event:message", { senderId, receiverId });
  socket.disconnect(); // Disconnect after emitting the event
};

export const allFriendRequests = async () => {
  const session = await getServerSession(authOption);
  const userId = new mongoose.Types.ObjectId(session?.user.id!);

  const allRequest = await FriendShipModel.find({
    receiver: userId,
    status: "pending",
  }).populate("sender", "fullName avatarUrl");

  const requests = allRequest.map((request) => {
    return {
      id: request._id.toString(),
      status: request.status,
      senderId: request.sender._id,
      senderName: request.sender.fullName,
      senderAvatarUrl: request.sender.avatarUrl,
      createdAt: request.createdAt,
    };
  });

  return requests;
};

export const accaptFriendRequest = async (
  requestId: string,
  accapt: boolean
) => {
  if (!requestId) return { messages: "Must provide a id!" };

  const _id = new mongoose.Types.ObjectId(requestId);
  const request = await FriendShipModel.findOne({ _id });

  if (!request) return { message: "No request found!" };

  if (!accapt) {
    await FriendShipModel.findByIdAndDelete({ _id });

    return { message: "Friend request rejected!" };
  }

  if (accapt) {
    await FriendShipModel.findByIdAndUpdate(_id, {
      status: "accapted",
    });

    return { message: "Friend request accapted!" };
  }
};

export const allFriends = async (userId: string) => {
  if (!userId) return { message: "Must provide a user id!" };

  const _id = new mongoose.Types.ObjectId(userId);
  const friends = await FriendShipModel.find({
    $or: [
      {
        sender: _id,
      },
      {
        receiver: _id,
      },
    ],
    status: "accapted",
  }).populate("sender receiver", "_id fullName avatarUrl");

  if (friends.length === 0) return [];

  const onlyFriends = friends.map((fr) =>
    fr.sender.equals(_id) ? fr.receiver : fr.sender
  );

  const fr = onlyFriends.map((f) => {
    return {
      id: f._id.toString(),
      fullName: f.fullName,
      avatarUrl: f.avatarUrl,
    };
  });

  return fr;
};
