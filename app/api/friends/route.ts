import { allFriends } from "@/app/mongodb/query/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.userId)
    return NextResponse.json(
      { message: "Must provide a userId" },
      { status: 400 }
    );
  const friends = await allFriends(body.userId);


  return NextResponse.json(friends);
};
