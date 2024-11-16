import { authOption } from "@/app/auth/components/AuthOption";
import { Chat } from "@/app/interfaces/interfaces";
import { allGroupChats, createChat } from "@/app/mongodb/query/chat";
import { getServerSession } from "next-auth/next";
 
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOption);
  console.log("Session =>> ", session);

  const chats = await allGroupChats();
  return NextResponse.json({ chats });
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { name, userId, members } = body;

    if (!name || !members) {
      return NextResponse.json(
        {
          success: false,
          message: "name and members is required to create a group!",
        },
        { status: 400 }
      );
    }

    if (members.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum 2 members required to create a group!",
        },
        { status: 400 }
      );
    }

    const allMembers = Array.from(new Set([...members, userId]));

    console.log("Members === ", allMembers);

    await createChat({
      createdBy: userId,
      groupChat: true,
      members: allMembers,
      groupName: name,
    });

    return NextResponse.json(
      { message: "Group Chat Created!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
};
