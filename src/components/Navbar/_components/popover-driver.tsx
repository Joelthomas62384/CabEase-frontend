"use client";

import React, { useState,useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/axios";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteMapModal from "./map-modal";

type Props = {
  children: React.ReactElement;
};

const PopoverDriver = ({ children }: Props) => {
  const queryClient = useQueryClient();


  const { data: driverData, isLoading: driverLoading, isError: driverError } = useQuery({
    queryKey: ["driver"],
    queryFn: async () => {
      const response = await axiosInstance.get("cabs/get-driver-profile");
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
  const [isChecked, setIsChecked] = useState(driverData?.on_duty ?? false);

  useEffect(() => {
    
  if(driverData?.on_dutty){
    setIsChecked(true)
  }else{
    setIsChecked(false)
  }
   
  }, [driverData])
  
  // Fetch active booking
  const { data: bookingData, isLoading: bookingLoading, isError: bookingError } = useQuery({
    queryKey: ["booking"],
    queryFn: async () => {
      const response = await axiosInstance.get("booking/get-booking-cab");
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    retry:false
  });


  const { mutate: toggleDuty, isPending: toggleLoading } = useMutation({
    mutationFn: async () => {
      setIsChecked((prev:boolean) => !prev);
      await axiosInstance.post("cabs/check-change");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
    onError: () => {
      setIsChecked((prev:boolean) => !prev);
    },
  });


  console.log(bookingData)
  const { mutate: completeBooking, isPending: completing } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`booking/complete-ride`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });


  

  return (
    <Popover>
        
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="p-4 space-y-4 rounded-lg shadow-lg border bg-white w-72">
        {driverLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin w-4 h-4" />
            Loading...
          </div>
        ) : driverError ? (
          <p className="text-sm text-red-500">Error loading driver data</p>
        ) : (
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">On Duty</Label>
            <Switch
              checked={isChecked}
              onCheckedChange={() => toggleDuty()}
              disabled={toggleLoading}
              className={`${toggleLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        )}

        {bookingLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin w-4 h-4" />
            Checking for active bookings...
          </div>
        ) : bookingError || !bookingData ? (
          <p className="text-sm text-gray-500">No active bookings</p>
        ) : (
          <div className="border p-3 rounded-lg bg-gray-100">
            <p className="text-sm font-semibold">Active Booking</p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">From:</span> {bookingData.start_location.name}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">To:</span> {bookingData.end_location.name}
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => completeBooking()}
              disabled={completing}
              className="mt-2 w-full"
            >
              {completing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Complete Ride"}
            </Button>

             <RouteMapModal children={<Button
              variant="default"
              size="sm"
              disabled={completing}
              className="mt-2 w-full"
            >
              {completing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Show Route"}
            </Button>
}
start={{
    lat: bookingData.start_location.latitude,
    lng: bookingData.start_location.longitude,
  
}}

end={{
    lat: bookingData.end_location.latitude,
    lng: bookingData.end_location.longitude,
}}
/> *
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverDriver;
