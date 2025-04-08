"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppSelector } from '@/store/hooks';
import { selectAllClicks } from '@/store/selectors/clickSelectors';
import { useGeocodedClicks } from '@/hooks/useGeoCodeClicks';

const MapLibreComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const clicks = useAppSelector(selectAllClicks);
  console.log('clicks', clicks);

  const geoFeatures = useGeocodedClicks();
  console.log('geoFeatures', geoFeatures);

  const geoJsonData = useMemo(() => ({
    type: "FeatureCollection",
    features: geoFeatures.map(feature => feature)
  }) as GeoJSON.FeatureCollection, [geoFeatures]);

  console.log('geoJsonData', geoJsonData);

  // Initialize map and layers only once on mount
  useEffect(() => {
    // Create the map instance
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-103.5917, 40.6699],
      zoom: 3,
    });

    // Set up sources and layers when the map loads
    mapRef.current.on('load', () => {
      console.log('Map loaded');

      // Add the GeoJSON source with clustering enabled
      mapRef.current!.addSource('clicks', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }, // Empty initially
        cluster: true,
        clusterMaxZoom: 14, // Maximum zoom level for clustering
        clusterRadius: 50, // Distance in pixels to cluster points
      });

      console.log('Source added:', mapRef.current!.getSource('clicks'));

      // Layer for clusters
      mapRef.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clicks',
        filter: ['has', 'point_count'], // Only show clustered points
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6', // Color for small clusters
            100,
            '#f1f075', // Color for medium clusters
            750,
            '#f28cb1', // Color for large clusters
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, // Radius for small clusters
            100,
            30, // Radius for medium clusters
            750,
            40, // Radius for large clusters
          ],
        },
      });

      // Layer for cluster counts
      mapRef.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'clicks',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count'], // Display raw cluster count
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      // Layer for unclustered points
      mapRef.current!.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clicks',
        filter: ['!', ['has', 'point_count']], // Only show unclustered points
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      // Set initial data for the source
      (mapRef.current!.getSource('clicks') as maplibregl.GeoJSONSource).setData(geoJsonData);
    });

    // Cleanup map on component unmount
    return () => mapRef.current!.remove();
  }, [geoJsonData]); // Empty dependency array ensures this runs only once

  // Update source data when geoJsonData changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource('clicks')) {
      (mapRef.current.getSource('clicks') as maplibregl.GeoJSONSource).setData(geoJsonData);
      console.log('Source data updated:', geoJsonData);
    }
  }, [geoJsonData]);

  return <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default MapLibreComponent;