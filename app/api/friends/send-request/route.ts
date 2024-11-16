import {
  allFriendRequests,
  sendFriendRequest,
} from "@/app/mongodb/query/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const allRequest = await allFriendRequests();
    return NextResponse.json(allRequest);
  } catch (error) {}
};
export const PUT = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { senderId: string; receiverId: string };

    console.log("sender id ==> ", body.senderId);
    console.log("receiver id ==> ", body.receiverId);

    const result = await sendFriendRequest(body.senderId, body.receiverId);

    if (result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Got Friend Request!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
};
