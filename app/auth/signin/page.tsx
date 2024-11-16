"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEyeFill } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SignInField, SignInSchema } from "../../zod/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../components/InputField";
import { signIn } from "next-auth/react";
import ErrorText from "../components/ErrorText";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const route = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const searchUrl = new URLSearchParams();
  const callbackUrl = searchUrl.get("callbackUrl") || "/messages";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInField>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<SignInField> = async (data) => {
    setErrorMessage("");
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (result?.ok) {
      route.replace(callbackUrl);
    }
    if (!result?.ok) {
      setErrorMessage(result?.error!);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-screen self-center">
        <div className="w-[45%] h-full md:px-5 py-3">
          <img
            className="w-full h-full object-cover"
            src="https://cdn.pixabay.com/photo/2015/01/21/14/14/imac-606765_1280.jpg"
          />
        </div>

        <div className="w-[45%] h-full px-12 py-3">
          <h6>Brand</h6>
          <div className="w-full">
            <h1 className="text-3xl text-black">Sign In to Your Account</h1>
            <p className="text-xs font-extralight text-gray-500 py-4">
              Enter your credentials to access your account securely.
            </p>

            <div className="flex flex-col gap-3">
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

              <ErrorText errorMessage={errorMessage} />

              <button
                className="btn w-full bg-black text-white rounded-lg mt-4"
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                <p>Sign In</p>
              </button>
              <div className="flex items-center gap-1 justify-center">
                <p>Don't have an account?</p>
                <Link href={"/auth/signup"} className="hover:link-hover">
                  Sign Up
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
      </div>
    </div>
  );
};

export default SignIn;
