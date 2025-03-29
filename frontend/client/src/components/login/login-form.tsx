"use client"

import { ISignUp } from "@/interface/auth/auth.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuAsterisk } from "react-icons/lu";
import { signupSchema } from "@/schemas/signup";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(signupSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md"
    >
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h1>

        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <label className="text-base tracking-wide font-semibold text-gray-800">
              User Name
            </label>
            <LuAsterisk className="text-xs text-red-500 ml-1" />
          </div>
          <input
            {...register("name")}
            className={`text-lg border ${errors.name ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            placeholder="Enter Username"
          />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <label className="text-base tracking-wide font-semibold text-gray-800">
              Email
            </label>
            <LuAsterisk className="text-xs text-red-500 ml-1" />
          </div>
          <input
            {...register("email")}
            className={`text-lg border ${errors.email ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            placeholder="johndoe@gmail.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <label className="text-base tracking-wide font-semibold text-gray-800">
              Password
            </label>
            <LuAsterisk className="text-xs text-red-500 ml-1" />
          </div>
          <input
            type="password"
            {...register("password")}
            className={`text-lg border ${errors.password ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <label className="text-base tracking-wide font-semibold text-gray-800">
              Phone Number
            </label>
            <LuAsterisk className="text-xs text-red-500 ml-1" />
          </div>
          <input
            {...register("phonenumber")}
            className={`text-lg border ${errors.phonenumber ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            placeholder="Enter your phone number"
          />
          {errors.phonenumber && (
            <p className="text-xs text-red-500">
              {errors.phonenumber.message}
            </p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-base tracking-wide font-semibold text-gray-800">
            Select Gender:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                {...register("gender")} 
                value="Male" 
                className="accent-blue-500" 
              />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                {...register("gender")} 
                value="Female" 
                className="accent-blue-500" 
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-lg font-semibold px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md text-white cursor-pointer hover:bg-blue-700 transition-all duration-300 mt-2"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignupPage;