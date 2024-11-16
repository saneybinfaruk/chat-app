import mongoose from "mongoose";

export interface SelectedUser {
  id: string;
  fullName: string;
  avatarUrl: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export interface Chat {
  _id: mongoose.Types.ObjectId;
  groupName: string;
  groupChat: boolean;
  createdBy: mongoose.Types.ObjectId;
  members: { _id: string; fullName: string; avatarUrl: string }[];
}

export interface FriendItem {
  id: string;
  fullName: string;
  avatarUrl: string;
}

export interface Message {
  _id?: string;
  messageId: string;
  chatId: string;
  content: string;
  sender: {
    _id: string;
    fullName: string;
    avatarUrl: string;
  };
  attachments: { thumbnail_url: string; url: string }[];
  createdAt?: Date;
  isRead?: boolean;
  readBy?: { _id: string; fullName: string; avatarUrl: string }[];
}
