"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  RegisterOptions,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { BsEyeFill } from "react-icons/bs";
import { FaCamera, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SignUpSchema, SignUpField } from "../../zod/schemas";
import InputField from "../components/InputField";
import { CldUploadWidget } from "next-cloudinary";
import { IoMdCloudUpload } from "react-icons/io";
import ErrorText from "../components/ErrorText";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<SignUpField>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpField> = async (data) => {
    try {
      setErrorMessage("");

      // console.log("APi == ", data);

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Append the selected image if available
      if (selectedImage) {
        formData.append("avatarUrl", selectedImage); // Attach the file
      }

      const response = await fetch("/api/users/new", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(response);
      if (result.error) setErrorMessage(result.error);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle image selection
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected file
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };
  return (
    <div className="flex w-full justify-center">
      <div className="flex h-screen self-center">
        <div className="w-[45%] h-full md:px-5 py-3">
          <h6>Brand</h6>
          <div className="w-full">
            <h1 className="text-3xl text-black">Create an account</h1>
            <p className="text-xs font-extralight text-gray-500 py-4">
              Descript yourself as clearly so that there are no mistakes.
            </p>
            <div className="flex flex-col items-center pb-3">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }} // Hide the input field
                onChange={handleImageChange}
              />

              {/* Clickable image or placeholder */}
              <label
                className="relative w-32 h-32 rounded-full overflow-hidden  cursor-pointer"
                htmlFor="fileInput"
              >
                <img
                  src={
                    previewUrl
                      ? previewUrl
                      : "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png"
                  }
                  alt="Selected"
                  className="w-full h-full object-cover bg-blue-500 cursor-pointer"
                />
                <IoMdCloudUpload className="w-32 h-32 text-red-50 absolute  bg-black rounded-full z-10 top-0 opacity-0 hover:opacity-80 p-3 transition-opacity duration-300" />
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <InputField
                name={"fullName"}
                register={register}
                placeholder={"Full Name"}
                error={errors.fullName!}
              />
              <InputField
                name={"email"}
                register={register}
                placeholder={"Email"}
                error={errors.email!}
              />

              <InputField
                name={"password"}
                register={register}
                placeholder={"Password"}
                error={errors.password!}
                type="password"
              />

              {errorMessage && <ErrorText errorMessage={errorMessage || ""} />}

              <button
                className="btn w-full bg-black text-white rounded-lg mt-4"
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                <p>Create account</p>
              </button>
              <div className="flex items-center gap-1 justify-center">
                <p>Already have an account?</p>
                <Link href={"/auth/signin"} className="hover:link-hover">
                  Login
                </Link>
              </div>
            </div>

            <div className="divider">or</div>

            <div className="w-full flex justify-center flex-col gap-5 ">
              <button className="btn bg-white flex items-center justify-center gap-2 border p-2 w-full rounded-lg border-black">
                <FcGoogle size={23} />
                <p>Continue with Google</p>
              </button>
              <button className="btn bg-white flex items-center justify-center gap-2 border p-2 w-full rounded-lg border-black">
                <FaGithub size={23} />
                <p>Continue with Github</p>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-violet-300 w-[55%] m-3 rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://cdn.pixabay.com/photo/2017/02/09/18/01/chat-2053032_1280.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
