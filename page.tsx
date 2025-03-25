"use client";

import { useState, useEffect } from "react";

type PlaceSuggestion = {
  name: string;
  lat: string;
  lon: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Fetch places with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchPlaces(query);
      }
    }, 300); // Debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Fetch places from Nominatim API
  const fetchPlaces = async (input: string) => {
    if (!input) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=20`,
        {
          headers: { "User-Agent": "YourAppName" },
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setSuggestions(
          data.map((place) => ({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
        );
      } else {
        console.error("Unexpected API Response:", data);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reverse Geocode (Get Address from Lat/Lon)
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      } else {
        console.error("No address found");
        return "Unknown location";
      }
    } catch (error) {
      console.error("Error fetching reverse geocode:", error);
      return "Error fetching location";
    }
  };

  // Get User’s Current Location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await reverseGeocode(latitude, longitude);
          setUserLocation(locationName);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-lg font-bold mb-4">OpenStreetMap Search & Reverse Geocoding</h1>

      {/* Button to Get User Location */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
        onClick={getUserLocation}
      >
        Get My Current Location
      </button>

      {/* Display User's Location */}
      {userLocation && (
        <p className="text-green-500 mb-2">📍 Your Location: {userLocation}</p>
      )}

      {/* Search Input */}
      <input
        type="text"
        className="border p-2 rounded-md w-80"
        placeholder="Search for a place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && <p className="text-gray-600 mt-2">Loading...</p>}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="mt-4 border p-2 rounded-md w-80  shadow-md">
          {suggestions.map((place, index) => (
            <li key={index} className="p-2 hover:bg-gray-600 cursor-pointer">
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
