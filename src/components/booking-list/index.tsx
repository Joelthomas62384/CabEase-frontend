import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import RiderDetail from "../Navbar/_components/admin-modal/_components/rider-details";

type Props = {
  arr: any;
};

const SearchDriver = ({ arr }: Props) => {
  return (
    <div className="space-y-2">
      {arr.cabs && arr?.cabs.map((item: any, index: any) => (
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

          {/* Distance and Price Info */}
          <div className="text-right">
            <div className="text-sm font-semibold">
              Distance: {arr.trip_distance_km.toFixed(2)} km
            </div>
            <div className="text-xs text-gray-600">
              Estimated Price: ₹{arr.estimated_price.toFixed(2)}
            </div>
          </div>

          <RiderDetail rider={item} />
          <Button variant="default">Book</Button>
        </div>
      ))}
    </div>
  );
};

export default SearchDriver;
