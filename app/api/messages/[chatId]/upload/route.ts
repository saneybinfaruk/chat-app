import { uploadFiles } from "@/app/utility/helper";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  console.log("upload");

  return NextResponse.json({ message: "Get Uploads!" });
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  console.log(files);
  

  const filesUrl = await uploadFiles(files);

  return NextResponse.json({ filesUrl });
};
