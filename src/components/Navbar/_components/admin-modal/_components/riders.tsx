"use client";
import axiosInstance from "@/axios";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import RiderDetail from "./rider-details";

type Props = {};

const Riders = (props: Props) => {
  const fetchRiders = async () => {
    const response = await axiosInstance.get("cabs/get-cabs?approved=true");
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rider"],
    queryFn: fetchRiders,
  });

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL
  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data...</p>;

  return (
    <>
      {/* Render only if data is available */}
      {data && data.length > 0 ? (
        data.map((item: any) => (
          <div key={item.id} className="w-full flex justify-between">
            <div className="flex gap-3 items-center">
                <Avatar>
                    <AvatarImage src={item.driver_image}  className="w-10 rounded-full"/>
                    <AvatarFallback>{item.user.full_name[0]}</AvatarFallback>
                </Avatar>
                <span>{item.user.full_name}</span>
            </div>
            <RiderDetail rider={item} />
            
          </div>
        ))
      ) : (
        <p>No riders found</p>
      )}
    </>
  );
};

export default Riders;
