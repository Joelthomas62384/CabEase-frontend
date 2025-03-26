"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const cabSchema = z.object({
  car_number: z.string().min(1, "Car number is required"),
  driver_age: z.coerce.number().min(18, "Driver must be at least 18"),
  mobile_number: z.string().min(10, "Enter a valid phone number"),
  vehicle_type: z.enum(["1", "2"]),
  price_per_km: z.coerce.number().min(1, "Price must be at least 1"),
  driving_license: z.any().refine((file) => file instanceof File, { message: "Driving license is required" }),
  vehicle_rc: z.any().refine((file) => file instanceof File, { message: "Vehicle RC is required" }),
  driver_image: z.any().optional(),
  languages: z.string().min(1, "Languages are required"),
  car_details: z.object({
    model: z.string().optional(),
    seats: z.coerce.number().optional(),
    safety_features: z.string().optional(),
  }).optional(),
});

type CabFormData = z.infer<typeof cabSchema>;

type Props = {
  children: React.ReactElement;
};

const CabRegister = ({ children }: Props) => {
  const form = useForm<CabFormData>({
    resolver: zodResolver(cabSchema),
    defaultValues: {
      car_number: "",
      driver_age: 18,
      mobile_number: "",
      vehicle_type: "1",
      price_per_km: 1,
      languages: "",
      car_details: { model: "", seats: 4, safety_features: "" },
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = async (data: CabFormData) => {
    console.log(data)
    const formData = new FormData();

    formData.append("car_number", data.car_number);
    formData.append("driver_age", data.driver_age.toString());
    formData.append("mobile_number", data.mobile_number);
    formData.append("vehicle_type", data.vehicle_type);
    formData.append("languages", data.languages);
    
    if (data.vehicle_type === "1" && data.car_details) {
        formData.append("car_details[model]", data.car_details.model || "");
        formData.append("car_details[seats]", data.car_details.seats?.toString() || "4");
        formData.append("car_details[safety_features]", data.car_details.safety_features || "");
        formData.append("price_per_km", "100");
    }

    // Append files
    if (data.driving_license) formData.append("driving_license", data.driving_license);
    if (data.vehicle_rc) formData.append("vehicle_rc", data.vehicle_rc);
    if (data.driver_image) formData.append("driver_image", data.driver_image);

    try {
      const response = await axiosInstance.post("cabs/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)

      if (response.status === 201) {
        console.log("Cab registered successfully");
        toast.success("Cab Registered Successfully");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["cabs"] });
      } else {
        console.error("Failed to register cab");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Your Cab</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            <FormField control={form.control} name="car_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter car number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="driver_age" render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="mobile_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter mobile number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="languages" render={({ field }) => (
              <FormItem>
                <FormLabel>Languages Spoken</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter languages" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="vehicle_type" render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border p-2 rounded-md">
                    <option value="1">Car</option>
                    <option value="2">Auto</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="driving_license" render={({ field }) => (
              <FormItem>
                <FormLabel>Driving License</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="vehicle_rc" render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle RC</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="driver_image" render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Image</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {form.watch("vehicle_type") === "1" && (
              <>
                <FormField control={form.control} name="car_details.model" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Model</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter car model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="car_details.seats" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Seats</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="car_details.safety_features" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safety Features</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter safety features (e.g., Airbags, CCTV)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CabRegister;
