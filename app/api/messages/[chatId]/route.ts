import { authOption } from "@/app/auth/components/AuthOption";
import { Message } from "@/app/interfaces/interfaces";
import MessageModel from "@/app/mongodb/models/message-model";
import {
  createMessage,
  messagesByChatId,
  updateMessagesAsRead,
  updateSingleMessageAsRead,
} from "@/app/mongodb/query/messages";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  { params: { chatId } }: { params: { chatId: string } }
) => {
  const messages = await messagesByChatId(chatId);

  return NextResponse.json({ messages });
};

export const POST = async (req: NextRequest) => {
  try {
    const { body } = await req.json();

    const chatId = new mongoose.Types.ObjectId(body.chatId as string);
    const sender = new mongoose.Types.ObjectId(body.sender._id as string);

    const message = await createMessage(
      body.messageId,
      chatId,
      body.content,
      sender,
      body.attachments
    );

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest, res: NextResponse) => {
  const { chatId, messageId, userId } = await req.json();

  if (messageId) {
    console.log("update each message ", userId);

    const result = await updateSingleMessageAsRead(chatId, messageId, userId);

    console.log('updateSingleMessageAsRead result ==> ', result);

    return NextResponse.json({ success: true, message: result });
  } else {
    const result = await updateMessagesAsRead(chatId, userId);

    console.log('updateMessagesAsRead result ==> ', result);
    

    return NextResponse.json({ success: true, message: result });
  }
};
