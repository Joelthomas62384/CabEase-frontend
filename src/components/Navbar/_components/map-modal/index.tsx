"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface RouteMapProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

interface ModalProps extends RouteMapProps {
  children: React.ReactElement;
}

const RouteMap: React.FC<RouteMapProps> = ({ start, end }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  
  const center = { lat: start.lat, lng: start.lng };

  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRoute(coords);
      }
    };

    fetchRoute();
  }, [start, end]);

  return (
    <MapContainer center={center} zoom={13} className="w-full h-[400px] rounded-2xl shadow-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {route.length > 0 && <Polyline positions={route} pathOptions={{ color: "blue" }} />}
    </MapContainer>
  );
};

const RouteMapModal: React.FC<ModalProps> = ({ start, end, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px] max-w-full">
        <h2 className="text-lg font-semibold mb-4">Route Map</h2>
        <RouteMap start={start} end={end} />
      </DialogContent>
    </Dialog>
  );
};

export default RouteMapModal;
