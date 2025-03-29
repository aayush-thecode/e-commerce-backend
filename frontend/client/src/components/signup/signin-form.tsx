"use client"

import { ISignUp } from "@/interface/auth/auth.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuAsterisk } from "react-icons/lu";
import { signupSchema } from "@/schemas/signup";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    console.log(data);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.4)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.98
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.form
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-100 opacity-70"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-100 opacity-70"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Create an Account
        </motion.h1>

        {/* Name Field */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <label className="text-base font-semibold text-gray-800 flex items-center">
            User Name <LuAsterisk className="text-xs text-red-500 ml-1" />
          </label>
          <motion.input
            {...register("name")}
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)"
            }}
            className={`text-lg border ${errors.name ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="Enter Username"
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-red-500 overflow-hidden"
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <label className="text-base font-semibold text-gray-800 flex items-center">
            Email <LuAsterisk className="text-xs text-red-500 ml-1" />
          </label>
          <motion.input
            {...register("email")}
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)"
            }}
            className={`text-lg border ${errors.email ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="johndoe@gmail.com"
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-red-500 overflow-hidden"
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <label className="text-base font-semibold text-gray-800 flex items-center">
            Password <LuAsterisk className="text-xs text-red-500 ml-1" />
          </label>
          <motion.input
            type="password"
            {...register("password")}
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)"
            }}
            className={`text-lg border ${errors.password ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="Enter password"
          />
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-red-500 overflow-hidden"
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Phone Number */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <label className="text-base font-semibold text-gray-800 flex items-center">
            Phone Number <LuAsterisk className="text-xs text-red-500 ml-1" />
          </label>
          <motion.input
            {...register("phonenumber")}
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)"
            }}
            className={`text-lg border ${errors.phonenumber ? "border-red-500 text-red-500" : "border-gray-300"} p-2 rounded-md placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="Enter your phone number"
          />
          {errors.phonenumber && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-red-500 overflow-hidden"
            >
              {errors.phonenumber.message}
            </motion.p>
          )}
        </motion.div>

        {/* Gender Selection */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-800">Select Gender:</label>
          <div className="flex space-x-4">
            <motion.label 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input type="radio" {...register("gender")} value="Male" className="accent-blue-500" />
              <span>Male</span>
            </motion.label>
            <motion.label 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input type="radio" {...register("gender")} value="Female" className="accent-blue-500" />
              <span>Female</span>
            </motion.label>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="submit"
          className="w-full text-lg font-semibold px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md text-white cursor-pointer transition-all duration-300"
        >
          Sign Up
        </motion.button>
      </motion.form>
    </div>
  );
};

export default SignupPage;