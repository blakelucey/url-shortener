"use client";

import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import style from './page.module.css'

// Dynamically import React Leaflet components to avoid SSR issues.
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false }
);
const Popup = dynamic(
  async () => (await import("react-leaflet")).Popup,
  { ssr: false }
);

// Dynamically import MarkerClusterGroup and assert its type.
const MarkerClusterGroup = dynamic(
  async () =>
    (await import("react-leaflet-markercluster")).default,
  { ssr: false }
) as React.ComponentType<{ children: React.ReactNode; iconCreateFunction?: (cluster: L.MarkerCluster) => L.DivIcon }>;

// import { staticGeoData } from "../../../../../staticGeoData"; // static data for testing
import { useGeocodedClicks } from "@/hooks/useGeoCodeClicks";

// Create a custom cluster icon using Leaflet’s divIcon.
const createClusterIcon = (cluster: L.MarkerCluster): L.DivIcon => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class=${style.custom_cluster_icon}><span>${count}</span></div>`,
    className: style.custom_cluster_icon, // The CSS class for additional styling.
    iconSize: L.point(40, 40, true),
  });
};

// Create a custom marker icon for unclustered markers.
const customMarkerIcon = L.divIcon({
  html: `<div class=${style.custom_marker}></div>`,
  className: style.custom_marker, // CSS class for marker styling.
  iconSize: L.point(12, 12, true),
});

const LeafletMapCluster = () => {
  // Convert GeoJSON features from staticGeoData into an array of marker objects.
  // GeoJSON coordinates are in [lng, lat] order; Leaflet expects [lat, lng].
  const geoFeatures = useGeocodedClicks();
  const markers = geoFeatures.features.map((feature, index) => {
    const [lat, lon] = feature.coordinates;
    return {
      id: index,
      position: [lat, lon] as [number, number],
    };
  });

  // Tile layer URL and attribution for OpenStreetMap.
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={[39.8169907, -91.2423657]} // [lat, lng]
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url={tileLayerUrl} attribution={attribution} />
      <MarkerClusterGroup iconCreateFunction={createClusterIcon}>
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={customMarkerIcon}>
            <Popup>
              <div>
                <p>Marker ID: {marker.id}</p>
                <p>
                  Coordinates: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default LeafletMapCluster;