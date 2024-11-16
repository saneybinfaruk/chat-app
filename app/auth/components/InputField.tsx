import React, { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { BsEyeFill } from "react-icons/bs";
import ErrorText from "./ErrorText";

interface Props {
  name: string;
  register: UseFormRegister<any>;
  placeholder: string;
  error: FieldError;
  type?: string;
}
const InputField = ({
  name,
  register,
  placeholder,
  error,
  type = "text",
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type={showPassword && type === 'password'?  "text" : type}
          className="grow"
          placeholder={placeholder}
          {...register(name)}
        />
        {type === "password" && (
          <button
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <BsEyeFill
              size={20}
              className={`${
                showPassword ? "text-violet-400" : "text-gray-200"
              } hover:text-violet-400 transition-colors duration-300`}
            />
          </button>
        )}
      </label>

      {error && <ErrorText errorMessage={error.message || ""} />}
    </div>
  );
};

export default InputField;
