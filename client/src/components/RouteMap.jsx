import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = ({ routes, onReset }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard-satellite",
        center: [-74.5, 40],
        zoom: 9,
      });
      // Add controls only once
      mapRef.current.addControl(new mapboxgl.NavigationControl());
    }
    
    const map = mapRef.current;

    const upsertSourcesAndLayers = () => {
      // ... (rest of your existing code for upserting layers)
      const routeFeatures = (routes || [])
        .filter((r) => r?.geometry?.type === "LineString")
        .map((r, idx) => ({
          type: "Feature",
          geometry: r.geometry,
          properties: { color: idx % 2 === 0 ? "#00FF99" : "#FF5A5A" },
        }));

      const waypointFeatures = (routes || [])
        .flatMap((r) => r?.waypoints || [])
        .filter((wp) => Array.isArray(wp.location))
        .map((wp, idx) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: wp.location },
          properties: { name: `${idx + 1}` },
        }));

      const routesFC = { type: "FeatureCollection", features: routeFeatures };
      const wpsFC = { type: "FeatureCollection", features: waypointFeatures };

      if (map.getSource("routes")) {
        map.getSource("routes").setData(routesFC);
      } else {
        map.addSource("routes", { type: "geojson", data: routesFC });
        map.addLayer({
          id: "routes",
          type: "line",
          source: "routes",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": ["get", "color"], "line-width": 5 },
        });
      }

      if (map.getSource("waypoints")) {
        map.getSource("waypoints").setData(wpsFC);
      } else {
        map.addSource("waypoints", { type: "geojson", data: wpsFC });
        map.addLayer({
          id: "waypoints",
          type: "symbol",
          source: "waypoints",
          layout: {
            "icon-image": "marker-15",
            "icon-allow-overlap": true,
            "text-field": ["get", "name"],
            "text-size": 14,
            "text-offset": [0, 0.9],
            "text-anchor": "top",
          },
          paint: { "text-color": "#ffffff" },
        });
      }

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (waypointFeatures.length >= 2) {
        const start = waypointFeatures[0].geometry.coordinates;
        const end =
          waypointFeatures[waypointFeatures.length - 1].geometry.coordinates;

        const startMarker = new mapboxgl.Marker({ color: "#00FF99" })
          .setLngLat(start)
          .setPopup(new mapboxgl.Popup().setText("Depot (Start)"))
          .addTo(map);

        const endMarker = new mapboxgl.Marker({ color: "#FF5A5A" })
          .setLngLat(end)
          .setPopup(new mapboxgl.Popup().setText("Final Destination"))
          .addTo(map);

        markersRef.current.push(startMarker, endMarker);
      }

      const bounds = new mapboxgl.LngLatBounds();
      routeFeatures.forEach((feature) => {
        feature.geometry.coordinates.forEach((coord) => {
          bounds.extend(coord);
        });
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
      }
    };

    const render = () => {
      if (!Array.isArray(routes) || routes.length === 0) {
        if (map.getSource("routes"))
          map
            .getSource("routes")
            .setData({ type: "FeatureCollection", features: [] });
        if (map.getSource("waypoints"))
          map
            .getSource("waypoints")
            .setData({ type: "FeatureCollection", features: [] });
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        return;
      }
      upsertSourcesAndLayers();
    };

    if (map.isStyleLoaded()) {
      render();
    } else {
      map.once("load", render);
    }
  }, [routes]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full h-[60vh] rounded-2xl shadow-2xl"
      />
      <Button
        onClick={onReset}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white hover:bg-gray-300 text-black cursor-pointer font-semibold "
      >
        Plan Another Route
      </Button>
    </div>
  );
};

export default RouteMap;
