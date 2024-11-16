import { authOption } from "@/app/auth/components/AuthOption";
import { User } from "@/app/interfaces/interfaces";
import { findAllUser } from "@/app/mongodb/query/users";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOption);

  const allUsers = (await findAllUser()) as User[];
  const users = allUsers.map((user) => {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl ? user.avatarUrl : "",
    };
  });

  return NextResponse.json(users);
};
