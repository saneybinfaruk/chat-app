import { createUser, findUserByEmail } from "@/app/mongodb/query/users";
import { SignUpSchema } from "@/app/zod/schemas";
import { NextRequest, NextResponse } from "next/server";
import bycrpt from "bcrypt";

export const POST = async (reguest: NextRequest) => {
  const formData = await reguest.formData();
  console.log("APi == ", formData);
  const avatarFile = formData.get("avatarUrl") as File;

  const validation = SignUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const {
    success: validationSuccessful,
    data: validatedData,
    error,
  } = validation;

  if (!validationSuccessful)
    return NextResponse.json(
      { errorMessage: error?.errors[0].message },
      { status: 400 }
    );

  const oldUser = await findUserByEmail(validatedData.email);
  console.log(oldUser);

  if (oldUser)
    return NextResponse.json({ error: "User already exist!" }, { status: 400 });

  // 2. Upload the image if provided
  let profileUrl = "";
  if (avatarFile) {
    const buffer = await avatarFile.arrayBuffer();
    // const blob = new Blob([buffer], { type: avatarFile.type });
    const nFile = new File([buffer], `${Date.now()}-${avatarFile.name}`, {
      type: avatarFile.type,
    });

    const formData = new FormData();
    formData.append("file", nFile);
    formData.append("upload_preset", "g2dueo8c");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/deb4rpsov/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log(data);

    if (!data.secure_url) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 }
      );
    }

    console.log(data);

    profileUrl = data.secure_url; // Get uploaded image URL
  }

  const hashedPassword = await bycrpt.hash(validatedData.password, 12);

  const newUser = {
    ...validatedData,
    password: hashedPassword,
    avatarUrl: profileUrl,
  };

  await createUser(newUser);

  return NextResponse.json({ message: "User Created!" }, { status: 200 });
};
