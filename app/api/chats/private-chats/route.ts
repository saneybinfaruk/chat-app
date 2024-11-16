import { authOption } from "@/app/auth/components/AuthOption";
import { allPrivateChats, createChat } from "@/app/mongodb/query/chat";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOption);
  const privateChats = await allPrivateChats(session?.user.id!);

  return NextResponse.json(privateChats);
};
export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOption);
  const body = await req.json();

  const { friendId } = body;

  const userId = new mongoose.Types.ObjectId(session?.user.id);

  const members = [friendId, session?.user.id];

  const chatId = await createChat({
    groupName: "",
    groupChat: false,
    createdBy: userId,
    members,
  });

  return NextResponse.json({ success: true, chatId });
};
