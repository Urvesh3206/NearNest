"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface MapPlace {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance: string;
  type: "business" | "service" | "hotel";
  rating: number;
}

interface LocationMapProps {
  userLat: number;
  userLng: number;
  locationName: string;
  places: MapPlace[];
  onSelectPlace?: (place: MapPlace) => void;
  className?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  userLat,
  userLng,
  locationName,
  places,
  onSelectPlace,
  className = "h-80 w-full rounded-3xl overflow-hidden shadow-card border border-border-hairline",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered at user's real coordinates
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap high quality tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // User pulsating marker
      const userIcon = L.divIcon({
        className: "custom-user-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);"></div>
            <div style="position: absolute; width: 44px; height: 44px; background: rgba(16, 185, 129, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; text-align: center;">
          <b style="color: #10b981; font-size: 13px;">📍 You Are Here</b><br/>
          <span style="font-size: 11px; color: #475569;">${locationName}</span>
        </div>
      `);

      // Radius circle around user (1.5 km walking distance)
      L.circle([userLat, userLng], {
        color: "#10b981",
        fillColor: "#10b981",
        fillOpacity: 0.08,
        radius: 1500,
        weight: 1.5,
        dashArray: "4, 6",
      }).addTo(map);

      // Add markers for nearby hotels, businesses & services
      places.forEach((place) => {
        let pinColor = "#f59e0b";
        let emoji = "🏪";

        if (place.type === "hotel") {
          pinColor = "#9333ea"; // Purple for hotels
          emoji = "🏨";
        } else if (place.type === "service") {
          pinColor = "#3b82f6"; // Blue for services
          emoji = "🛠️";
        }

        const placeIcon = L.divIcon({
          className: "custom-place-pin",
          html: `
            <div style="background: ${pinColor}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.18); cursor: pointer; transition: transform 0.2s;">
              ${emoji}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 170px; padding: 4px;">
            <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${place.name}</div>
            <div style="font-size: 11px; color: #64748b; margin: 2px 0;">
              ${place.category} • <b style="color: #10b981;">${place.distance}</b>
            </div>
            <div style="font-size: 11px; color: #f59e0b; margin-bottom: 6px;">
              ★ ${place.rating} Rating
            </div>
          </div>
        `);

        marker.on("click", () => {
          onSelectPlace?.(place);
        });
      });

      mapInstanceRef.current = map;
    });


    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLat, userLng, locationName, places]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
