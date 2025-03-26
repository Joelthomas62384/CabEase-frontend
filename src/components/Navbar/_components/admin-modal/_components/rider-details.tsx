"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/axios";
import { toast } from "sonner";


type RiderDetailsProps = {
  rider: {
    id: number;
    car_number: string;
    driver_age: number;
    driving_license: string;
    languages: string;
    car_details: string | null;
    mobile_number: string;
    vehicle_rc: string;
    vehicle_type: string;
    price_per_km: number;
    approved: boolean;
    driver_image: string;
    on_dutty: boolean;
    busy: boolean;
    user: {
      mobile: string;
      full_name: string;
      is_driver: boolean;
      is_superuser?: boolean;
    };
  };
};

const RiderDetail = ({ rider }: RiderDetailsProps) => {
    const { user } = useSelector((state: RootState) => state.user);
    const queryClient = useQueryClient();
    
    const approveRider = async () => {
        try {
            await axiosInstance.put(`cabs/approve/${rider.id}`);
            toast.success(`${rider.approved ? 'Unapproved Succesfully!' : 'Approved Succesfully!'}`);
            queryClient.invalidateQueries({ queryKey: ["rider"] });
        } catch (error) {
            console.error(error);
            toast.error("Error approving rider");
        }
    };
    
    return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">View Rider Details</Button>
      </DialogTrigger>
      
      <DialogContent className="w-full sm:w-[500px] max-h-[80vh] overflow-y-auto p-6 rounded-lg">
        <DialogTitle className="text-xl font-bold mb-2">Rider Details</DialogTitle>
        <Separator className="mb-4" />

        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={rider.driver_image}
                alt="Driver"
                className="w-20 h-20 object-cover rounded-full border"
              />
              <div>
                <h2 className="text-lg font-semibold">{rider.user.full_name}</h2>
                <p className="text-sm text-gray-500">Mobile: {rider.mobile_number}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Car Number:</strong> {rider.car_number}</p>
              <p><strong>Driver's Age:</strong> {rider.driver_age}</p>
              <p><strong>Languages:</strong> {rider.languages}</p>
              <p><strong>Price per KM:</strong> ₹{rider.price_per_km}</p>
              {rider.car_details && <p><strong>Car Details:</strong> {rider.car_details}</p>}
              <p><strong>On Duty:</strong> {rider.on_dutty ? "Yes" : "No"}</p>
              <p><strong>Currently Busy:</strong> {rider.busy ? "Yes" : "No"}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <a
                href={rider.vehicle_rc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Vehicle RC
              </a>
              <a
                href={rider.driving_license}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Driving License
              </a>
            </div>

            {user?.is_superuser && (
              <Button onClick={approveRider} className="mt-4" variant={rider.approved ? "destructive" : "default"}>
                {rider.approved ? "Unapprove" : "Approve"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiderDetail;
