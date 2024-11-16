import { authOption } from "@/app/auth/components/AuthOption";
import { Chat, User } from "@/app/interfaces/interfaces";
import { allGroupChats, chatById, createChat } from "@/app/mongodb/query/chat";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const {chatId} = await req.json();

  const chat = await chatById(chatId)

  
  return NextResponse.json({success: true, chat: chat});
};
