"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/axios";

// Define validation schema using Zod
const registerSchema = z
  .object({
    full_name: z.string().min(3, "Full name must be at least 3 characters"),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSuccess?: () => void; // Accepts a callback to close the modal
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
     
        const response = await axiosInstance.post('user/register', data)
        const {data:responseData} = response.data
        if (response.status === 201){
            toast.success("User registered successfully!");

            if (onSuccess) onSuccess(); 
        }else{
            if (responseData.includes('mobile')){
                toast.error("Mobile number already exists");
            }

        }
      

    } catch (error) {
      toast.error("Registration failed", { description: "Please try again." });
    }
  };

  return (
    <div className="mx-auto p-6 bg-white  rounded-xl">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input type="text" {...register("full_name")} placeholder="John Doe" />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium">Mobile</label>
          <Input type="text" {...register("mobile")} placeholder="9876543210" />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <Input type="password" {...register("confirm_password")} placeholder="••••••••" />
          {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full ">
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
