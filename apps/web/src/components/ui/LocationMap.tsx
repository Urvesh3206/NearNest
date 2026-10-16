"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapPlace {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance: string;
  type: "business" | "service" | "hotel";
  rating: number;
  rate?: string;
  phone?: string;
}

export interface LocationMapProps {
  userLat: number;
  userLng: number;
  locationName: string;
  radiusKm?: number;
  places: MapPlace[];
  onSelectPlace?: (place: MapPlace) => void;
  className?: string;
}

function getCategoryEmoji(category: string, type: string): string {
  const c = category.toLowerCase();
  if (c.includes("electric")) return "⚡";
  if (c.includes("plumb")) return "🔧";
  if (c.includes("ac") || c.includes("cool")) return "❄️";
  if (c.includes("maid") || c.includes("clean")) return "🧹";
  if (c.includes("tutor") || c.includes("teacher")) return "📚";
  if (c.includes("carpenter") || c.includes("wood")) return "🔨";
  if (c.includes("yoga") || c.includes("fitness")) return "🧘";
  if (c.includes("baby") || c.includes("care")) return "👶";
  if (c.includes("driver") || c.includes("car")) return "🚗";
  if (c.includes("tech") || c.includes("smart") || c.includes("computer")) return "💻";
  if (type === "hotel") return "🏨";
  if (type === "business") return "🏪";
  return "🛠️";
}

export const LocationMap: React.FC<LocationMapProps> = ({
  userLat,
  userLng,
  locationName,
  radiusKm = 3,
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
        zoom: radiusKm <= 1 ? 16 : radiusKm <= 3 ? 15 : 14,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap high quality tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // User pulsating live location marker
      const userIcon = L.divIcon({
        className: "custom-user-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 22px; height: 22px; background: #059669; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 14px rgba(5, 150, 105, 0.9);"></div>
            <div style="position: absolute; width: 42px; height: 42px; background: rgba(16, 185, 129, 0.3); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup(`
        <div style="font-family: Arial, sans-serif; padding: 6px; text-align: center; min-width: 160px;">
          <div style="color: #059669; font-weight: bold; font-size: 13px;">📍 Live Resident Location</div>
          <div style="font-size: 11px; color: #334155; margin-top: 2px;">${locationName}</div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 4px;">Lat: ${userLat.toFixed(4)}, Lng: ${userLng.toFixed(4)}</div>
        </div>
      `);

      // Radius circle around user matching selectedRadius
      const circleRadiusMeters = (radiusKm || 3) * 1000;
      L.circle([userLat, userLng], {
        color: "#10b981",
        fillColor: "#10b981",
        fillOpacity: 0.07,
        radius: circleRadiusMeters,
        weight: 1.5,
        dashArray: "5, 6",
      }).addTo(map);

      // Add markers for nearby providers
      places.forEach((place) => {
        const emoji = getCategoryEmoji(place.category, place.type);
        const pinBg = place.type === "service" ? "#0284c7" : "#f59e0b";

        const placeIcon = L.divIcon({
          className: "custom-place-pin",
          html: `
            <div style="background: ${pinBg}; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.22); cursor: pointer; transition: transform 0.2s;">
              ${emoji}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif; min-width: 190px; padding: 6px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 18px;">${emoji}</span>
              <div>
                <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${place.name}</div>
                <div style="font-size: 11px; color: #0284c7; font-weight: 600;">${place.category}</div>
              </div>
            </div>
            <div style="font-size: 11px; color: #475569; margin: 4px 0; border-top: 1px solid #f1f5f9; padding-top: 4px;">
              Proximity: <strong style="color: #059669;">${place.distance} away</strong>
            </div>
            ${place.rate ? `<div style="font-size: 11px; color: #0f172a;">Rate: <strong>${place.rate}</strong></div>` : ''}
            <div style="font-size: 11px; color: #d97706; margin-top: 2px;">
              ★ ${place.rating} Rating
            </div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px;">
              GPS: ${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}
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
  }, [userLat, userLng, locationName, radiusKm, places]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};

export default LocationMap;
