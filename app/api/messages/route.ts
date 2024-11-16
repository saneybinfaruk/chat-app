import { authOption } from "@/app/auth/components/AuthOption";
import { createMessage } from "@/app/mongodb/query/messages";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ message: "Get Messages" });
};


