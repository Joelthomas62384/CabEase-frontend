"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteMapModal from "./map-modal";
import { DialogTitle } from "@/components/ui/dialog";

interface Props {
  children: React.ReactElement;
}

const PopoverUserModal: React.FC<Props> = ({ children }) => {
  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: bookingError,
  } = useQuery({
    queryKey: ["my-booking"],
    queryFn: async () => {
      const response = await axiosInstance.get("booking/my-booking");
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    retry: false,
  });

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      
      <PopoverContent className="p-4 space-y-4 rounded-lg shadow-lg border bg-white w-72">
        {bookingLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin w-4 h-4" /> Checking for bookings...
          </div>
        ) : bookingError || !bookingData ? (
          <p className="text-sm text-gray-500">No active bookings</p>
        ) : (
          <div className="border p-3 rounded-lg bg-gray-100">
            <p className="text-sm font-semibold">Your Booking</p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">From:</span> {bookingData.start_location.name}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">To:</span> {bookingData.end_location.name}
            </p>

            <RouteMapModal
              start={{
                lat: bookingData.start_location.latitude,
                lng: bookingData.start_location.longitude,
              }}
              end={{
                lat: bookingData.end_location.latitude,
                lng: bookingData.end_location.longitude,
              }}
            >
              <Button variant="default" size="sm" className="mt-2 w-full">
                Show Route
              </Button>
            </RouteMapModal>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverUserModal;