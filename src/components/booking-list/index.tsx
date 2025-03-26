"use client"

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import RiderDetail from "../Navbar/_components/admin-modal/_components/rider-details";
import axiosInstance from "@/axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  arr: any;
  from: any;
  to: any;
};

const SearchDriver = ({ arr, from, to }: Props) => {
    const queryClient =  useQueryClient()
  const handleBooking = async ( cab: any) => {
    console.log(cab , from , to)
    try {
      const response = await axiosInstance.post("booking/book", {
        driver_id: cab.user.id,
        cab_id: cab.id,
        start_location: { name: from.place, latitude: from.latitude, longitude: from.longitude },
        end_location: { name: to.place, latitude: to.latitude, longitude: to.longitude },
      });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["my-booking"] });
      toast.success("Cab booked successfully!");
      console.log("Booking Response:", response.data);
    } catch (error:any) {
      console.error("Booking failed:", error);
      toast.error("Failed to book the cab. Try again." + error.response.data.error);
    }
  };

  return (
    <div className="space-y-2">
      {arr.cabs && arr.cabs.length > 0 ? (
        arr.cabs.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between border p-3 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={item.driver_image || "https://via.placeholder.com/50"}
                />
                <AvatarFallback>{item.user.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{item.user.full_name}</div>
                <div className="text-xs text-gray-600">{item.user.mobile}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold">
                Distance: {arr.trip_distance_km.toFixed(2)} km
              </div>
              <div className="text-xs text-gray-600">
                Estimated Price: ₹{arr.estimated_price.toFixed(2)}
              </div>
            </div>

            <RiderDetail rider={item} />
            <Button
              variant="default"
              onClick={() => handleBooking(item)}
            >
              Book
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">No results found</div>
      )}
    </div>
  );
};

export default SearchDriver;
