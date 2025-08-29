import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = ({ routes }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.5, 40],
        zoom: 9,
      });
    }

    const map = mapRef.current;

    const upsertSourcesAndLayers = () => {
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
          paint: { "line-color": ["get", "color"], "line-width": 4 },
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
            "text-field": ["get", "name"], // Show numbers
            "text-size": 14,
            "text-offset": [0, 0.8],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#ffffff",
          },
        });
      }

      // remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (waypointFeatures.length >= 2) {
        const start = waypointFeatures[0].geometry.coordinates;
        const end =
          waypointFeatures[waypointFeatures.length - 1].geometry.coordinates;

        const startMarker = new mapboxgl.Marker({ color: "lime" })
          .setLngLat(start)
          .setPopup(new mapboxgl.Popup().setText("Depot (Start)"))
          .addTo(map);

        const endMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(end)
          .setPopup(new mapboxgl.Popup().setText("Destination (End)"))
          .addTo(map);

        markersRef.current.push(startMarker, endMarker);
      }

      const bounds = new mapboxgl.LngLatBounds();
      waypointFeatures.forEach((f) => bounds.extend(f.geometry.coordinates));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
      }
    };

    const render = () => {
      if (!Array.isArray(routes) || routes.length === 0) {
        if (map.getSource("routes"))
          map.getSource("routes").setData({ type: "FeatureCollection", features: [] });
        if (map.getSource("waypoints"))
          map.getSource("waypoints").setData({ type: "FeatureCollection", features: [] });
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        return;
      }
      upsertSourcesAndLayers();
    };

    if (map.isStyleLoaded()) render();
    else map.once("load", render);
  }, [routes]);

  return (
    <div ref={mapContainer} className="w-full h-[500px] rounded-xl shadow-lg" />
  );
};

export default RouteMap;
