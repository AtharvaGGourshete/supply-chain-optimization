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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  onError(null);

  try {
    // Geocode depot + all locations
    const depotCoords = await geocodeAddress(depot);
    const locationCoords = await Promise.all(
      locations.map((loc) => geocodeAddress(loc))
    );

    const coordinates = [depotCoords, ...locationCoords];

    const body = { coordinates, profile };

    const res = await fetch("http://localhost:3000/api/optimize", {
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
    <Card className="bg-neutral-900 border border-neutral-700 text-white">
      <CardHeader>
        <CardTitle> Enter Route Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Depot input */}
          <Input
            value={depot}
            onChange={(e) => setDepot(e.target.value)}
            placeholder="Depot address"
            required
            className="bg-neutral-800 border-neutral-600 text-white"
          />

          {/* Delivery locations */}
          {locations.map((loc, idx) => (
            <Input
              key={idx}
              value={loc}
              onChange={(e) => {
                const next = [...locations];
                next[idx] = e.target.value;
                setLocations(next);
              }}
              placeholder={`Delivery ${idx + 1}`}
              required
              className="bg-neutral-800 border-neutral-600 text-white"
            />
          ))}

          {/* Add location button */}
          <Button
            type="button"
            variant="secondary"
            onClick={addLocation}
            className="w-full"
          >
            Add Delivery
          </Button>

          {/* Profile dropdown */}
          <Select value={profile} onValueChange={setProfile}>
            <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="driving">Driving</SelectItem>
              <SelectItem value="driving-traffic">Driving with Traffic</SelectItem>
            </SelectContent>
          </Select>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
          Optimize Routes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
