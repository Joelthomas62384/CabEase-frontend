"use client";

import Banner from "@/components/banner";
import React, { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@/components/ui/Spinner";
import axiosInstance from "@/axios";
import SearchDriver from "@/components/booking-list";

type Place = {
  name: string;
  lat: string;
  lon: string;
};

const fetchPlaces = async (input: string): Promise<Place[]> => {
  if (!input) return [];
  const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: { q: input, format: "json", addressdetails: 1, limit: 10 },
    headers: { "User-Agent": "MyBookingApp" },
  });

  return response.data.map((place: any) => ({
    name: place.display_name,
    lat: place.lat,
    lon: place.lon,
  }));
};

const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon, format: "json" },
      headers: { "User-Agent": "MyBookingApp" },
    });
    return response.data.display_name || null;
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return null;
  }
};

const locationDefault = {
  place : "",
  latitude : "",
  longitude : "",
}

const Page = () => {
  const [fromInput, setFromInput] = useState(locationDefault);
  const [toInput, setToInput] = useState(locationDefault);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false); 
  const [getSearch, setgetSearch] = useState([])

  const fetchCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsFetchingLocation(true); 
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const placeName = await reverseGeocode(latitude, longitude);
          if (placeName) {
            setFromInput({
              place : placeName,
              latitude : latitude.toString(),
              longitude : longitude.toString(),
            });
            setFromSelected(true);
            setLocationFetched(true);
          }
          setIsFetchingLocation(false); 
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setIsFetchingLocation(false); 
        }
      );
    }
  };

  useEffect(() => {
    if (!locationFetched && !fromInput.place) {
      fetchCurrentLocation();
    }
  }, [locationFetched, fromInput]);

  const { data: fromSuggestions, isLoading: fromLoading } = useQuery({
    queryKey: ["fromPlace", fromInput],
    queryFn: () => fetchPlaces(fromInput.place),
    enabled: fromInput.place.length > 2,
  });

  const { data: toSuggestions, isLoading: toLoading } = useQuery({
    queryKey: ["toPlace", toInput],
    queryFn: () => fetchPlaces(toInput.place),
    enabled: toInput.place.length > 2, 
  });


  const onSearchClick = async ()=>{
    const data = {
      from : {
        latitude : fromInput.latitude,
        longitude : fromInput.longitude,
      },
      to : {
        latitude : toInput.latitude,
        longitude : toInput.longitude,
      },
      pickup_time : new Date().toISOString(),
    }
    const response = await axiosInstance.post('cabs/get-riders', data)
    if (response.status === 200){
      console.log(response.data)
      setgetSearch(response.data)
    } else {
      console.error("Failed to get riders")
    }
  }

  return (
    <>
      <Banner /> 
      <div className="w-full max-w-6xl mx-auto mt-10 p-4 rounded-xl">
        <div className="flex items-start space-x-3">
          <Command className="w-full border border-gray-300 rounded-lg shadow-xl">
            <CommandInput
              className="placeholder:text-gray-400 p-3"
              placeholder="From"
              value={fromInput.place}
              onValueChange={(value) => {
                setFromInput({...fromInput, place : value});
                setFromSelected(false);
              }}
            />
            {!fromSelected && fromInput.place.length > 2 && (
              <CommandList className="rounded-b-lg shadow-xl">
                {fromLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner className="h-6 w-6 text-gray-500" />
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {fromSuggestions?.map((place) => (
                        <CommandItem
                          key={place.lat + place.lon}
                          className="hover:!bg-gray-300 cursor-pointer transition-all"
                          onSelect={() => {
                            setFromInput({
                              place : place.name,
                              latitude : place.lat,
                              longitude : place.lon,
                            });
                            setFromSelected(true);
                          }}
                        >
                          {place.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            )}
          </Command>

          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white ml-2 px-4 py-2 rounded-lg shadow-md flex items-center"
            onClick={fetchCurrentLocation}
            disabled={isFetchingLocation}
          >
            {isFetchingLocation ? (
              <>
                <Spinner className="h-5 w-5 mr-2" /> Locating...
              </>
            ) : (
              "Use Current Location"
            )}
          </Button>

          <Separator orientation="vertical" className="h-10 w-[1px] bg-gray-300" />

          <Command className="w-full border border-gray-300 rounded-lg shadow-xl">
            <CommandInput
              className="placeholder:text-gray-400 p-3"
              placeholder="To"
              value={toInput.place}
              onValueChange={(value) => {
                setToInput({...toInput, place:value});
                setToSelected(false);
              }}
            />
            {!toSelected && toInput.place.length > 2 && (
              <CommandList className="rounded-b-lg shadow-xl">
                {toLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner className="h-6 w-6 text-gray-500" />
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {toSuggestions?.map((place) => (
                        <CommandItem
                          key={place.lat + place.lon}
                          className="hover:!bg-gray-300 cursor-pointer transition-all"
                          onSelect={() => {
                            setToInput({
                              place : place.name,
                              latitude : place.lat,
                              longitude : place.lon,
                            });
                            setToSelected(true);
                          }}
                        >
                          {place.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            )}
          </Command>

          <Button onClick={onSearchClick} className="bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 cursor-pointer shadow-3xl">
            Search
          </Button>
        </div>

      <div className="mt-9">
      <SearchDriver arr={getSearch} />
      </div>
      </div>
    </>
  );
};

export default Page;
