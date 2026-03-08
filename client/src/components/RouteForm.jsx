import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL

const geocodeAddress = async (address) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${token}&limit=1`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.features?.length) throw new Error(`Could not geocode: ${address}`);
  return data.features[0].geometry.coordinates; // [lng, lat]
};

const RouteForm = ({ onRoutesOptimized, onError, setLoading }) => {
  const [depot, setDepot] = useState("");
  const [locations, setLocations] = useState([""]);
  const [profile, setProfile] = useState("driving");

  const addLocation = () => setLocations([...locations, ""]);

  const removeLocation = (index) => {
    if (locations.length > 1) {
      const next = locations.filter((_, idx) => idx !== index);
      setLocations(next);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError(null);

    try {
      const depotCoords = await geocodeAddress(depot);
      const locationCoords = await Promise.all(
        locations.map((loc) => geocodeAddress(loc))
      );
      const coordinates = [depotCoords, ...locationCoords];
      const body = { coordinates, profile };

      const res = await fetch(`http://${API_URL}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Optimization failed");

      onRoutesOptimized(data.routes);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border border-neutral-700 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Enter Route Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={depot}
            onChange={(e) => setDepot(e.target.value)}
            placeholder="Depot Address (Start)"
            required
            className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
          />

          {locations.map((loc, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Input
                value={loc}
                onChange={(e) => {
                  const next = [...locations];
                  next[idx] = e.target.value;
                  setLocations(next);
                }}
                placeholder={`Delivery Location ${idx + 1}`}
                required
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
              />
              {locations.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLocation(idx)}
                  className="text-red-500 hover:bg-red-900/50 hover:text-red-400"
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          ))}
          <div className="flex gap-5">
            <Button
              type="button"
              variant="outline"
              onClick={addLocation}
              className="w-40 border-dashed bg-[#1F2326] border-green-500 text-green-500 hover:bg-green-900/50 hover:text-green-400 cursor-pointer"
            >
              Add Delivery Location
            </Button>

            <Select value={profile} onValueChange={setProfile} className="">
              <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white cursor-pointer">
                <SelectValue placeholder="Select transportation profile" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                <SelectItem value="driving" className="hover:bg-neutral-700 cursor-pointer">
                  Driving
                </SelectItem>
                <SelectItem
                  value="driving-traffic"
                  className="hover:bg-neutral-700 cursor-pointer"
                >
                  Driving with Traffic
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-52 bg-[#1F2326] hover:bg-white text-white hover:text-black cursor-pointer font-bold text-lg py-6"
          >
            <Route />
            Optimize Routes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
