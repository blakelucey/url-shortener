import { useAppSelector } from '@/store/hooks';
import { selectAllClicks } from '@/store/selectors/clickSelectors';
import React from 'react';


// This hook takes an array of clicks and returns GeoJSON features.
export function useGeocodedClicks() {
  const [geoFeatures, setGeoFeatures] = React.useState<any[]>([]);
  const clicks = useAppSelector(selectAllClicks);

  React.useEffect(() => {
    if (!clicks || clicks.length === 0) {
      setGeoFeatures([]);
      return;
    }

    // Build a set of unique location strings.
    const uniqueLocations = new Set<string>();
    clicks.forEach(click => {
      const loc = `${click.city}, ${click.region}, ${click.country}, ${click.postal}`;
      uniqueLocations.add(loc);
    });
    const locationsArr = Array.from(uniqueLocations);

    // A mapping from location string to its [lon, lat] coordinate.
    const locationToCoords: Record<string, [number, number]> = {};

    // A helper function to geocode a single location via Nominatim.
    const geocodeLocation = async (loc: string) => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(loc)}`;
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'YourAppName/1.0 (youremail@example.com)' }
        });
        const data = await res.json();
        if (data && data.length > 0) {
          // Note: Nominatim returns lat/ lon as strings.
          return [parseFloat(data[0].lon), parseFloat(data[0].lat)] as [number, number];
        }
      } catch (err) {
        console.error("Error geocoding location:", loc, err);
      }
      return null;
    };

    const fetchAllCoordinates = async () => {
      // Sequentially fetch coordinates for each unique location.
      // (Alternatively, you can run them in parallel, but respect usage limits.)
      for (const loc of locationsArr) {
        if (!(loc in locationToCoords)) {
          const coords = await geocodeLocation(loc);
          if (coords) {
            locationToCoords[loc] = coords;
          }
        }
      }
      // Build features: for each click, assign coordinates based on its location.
      const features = clicks
        .map(click => {
          const loc = `${click.city}, ${click.region}, ${click.country}, ${click.postal}`;
          const coords = locationToCoords[loc];
          if (coords) {
            return {
              geometry: {
                type: "Point",
                coordinates: coords
              },
            };
          }
          return null;
        })
        .filter(f => f !== null);

      setGeoFeatures(features as any[]);
    };

    fetchAllCoordinates();
  }, [clicks]);

  return geoFeatures;
}