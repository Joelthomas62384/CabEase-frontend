"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import axiosInstance from "@/axios";
import { useDispatch } from "react-redux";
import { setLoggedIn, setUser } from "@/Redux/Slices/userSlice";
import { toast } from "sonner";

const loginSchema = z.object({
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  password: z.string()
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;  // Accept a callback to close modal
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axiosInstance.post("/user/login", data);

      console.log("Login Response:", response);

      if (response.status === 200) {
        dispatch(setUser(response.data));
        dispatch(setLoggedIn(true));

        toast.success("User Successfully logged in", {
          description: "User has been successfully logged in",
        });

        if (onSuccess) onSuccess(); // Close modal
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid Credentials", {
        description: "Invalid credentials provided",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter mobile number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Login</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
