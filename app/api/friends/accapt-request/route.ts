import { accaptFriendRequest } from "@/app/mongodb/query/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  return NextResponse.json({ message: "Accapt request" });
};

export const PUT = async (req: NextRequest) => {
  const body = (await req.json()) as { requestId: string; accapt: boolean };

  const request = await accaptFriendRequest(body.requestId, body.accapt);

  return NextResponse.json(request);
};
