"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/axios";
import { RootState } from "@/Redux/store";

type Props = {
  children: React.ReactNode;
};

const LocationProvider = ({ children }: Props) => {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user);
  const prevLocation = useRef<{ latitude: number; longitude: number } | null>(null);
  const lastUpdateTime = useRef<number | null>(null);

  useEffect(() => {
    if (isLoggedIn && user?.is_driver) {
      console.log("🚗 Tracking location...");

      const sendLocation = async (latitude: number, longitude: number) => {
        try {
          await axiosInstance.post("cabs/update-path", { latitude, longitude });
          console.log("✅ Location sent to API:", latitude, longitude);
        } catch (error) {
          console.error("❌ Error sending location:", error);
        }
      };

      // Watch position and send updates only when needed
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log("📍 Current Location:", latitude, longitude);

          // Send update if the location has changed or if 5 minutes have passed
          const currentTime = Date.now();
          const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes

          if (
            !prevLocation.current ||
            getDistance(prevLocation.current.latitude, prevLocation.current.longitude, latitude, longitude) > 0.05 ||
            (lastUpdateTime.current && currentTime - lastUpdateTime.current > fiveMinutesInMilliseconds)
          ) {
            prevLocation.current = { latitude, longitude };
            lastUpdateTime.current = currentTime;
            sendLocation(latitude, longitude);
          } else {
            // console.log("⚠️ Location unchanged, not sending update.");
          }
        },
        (error) => {
          // Handle geolocation errors and log them
          // console.error("❌ Geolocation Error:", error);
          // Optionally retry or handle error states here
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => {
        console.log("🛑 Stopping location tracking...");
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [user, isLoggedIn]);

  return <>{children}</>;
};

export default LocationProvider;

// Helper function to calculate distance between two coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
