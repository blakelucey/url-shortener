import { useAppSelector } from '@/store/hooks';
import { selectAllClicks } from '@/store/selectors/clickSelectors';
import React from 'react';

interface MarkerFeature {
  id: number;
  coordinates: [number, number]; // [lat, lng] order for Leaflet markers
}

interface MarkerFeatureCollection {
  features: MarkerFeature[];
}

export function useGeocodedClicks(): MarkerFeatureCollection {
  const [data, setData] = React.useState<MarkerFeatureCollection>({ features: [] });
  const clicks = useAppSelector(selectAllClicks);

  React.useEffect(() => {
    if (!clicks || clicks.length === 0) {
      setData({ features: [] });
      return;
    }

    // Build a set of unique location strings.
    const uniqueLocations = new Set<string>();
    clicks.forEach(click => {
      const loc = `${click.city}, ${click.region}, ${click.country}, ${click.postal}`;
      uniqueLocations.add(loc);
    });
    const locationsArr = Array.from(uniqueLocations);

    const locationToCoords: Record<string, [number, number]> = {};

    // Geocode a location using Nominatim.
    // Returns coordinates in [lat, lng] order for Leaflet markers.
    const geocodeLocation = async (loc: string): Promise<[number, number] | null> => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(loc)}`;
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'YourAppName/1.0 (youremail@example.com)' },
        });
        const result = await res.json();
        if (result && result.length > 0) {
          const lon = parseFloat(result[0].lon);
          const lat = parseFloat(result[0].lat);
          if (!isNaN(lon) && !isNaN(lat)) {
            // Swap order to [lat, lon] for Leaflet.
            return [lat, lon];
          }
        }
      } catch (err) {
        console.error('Error geocoding location:', loc, err);
      }
      return null;
    };

    const fetchAllCoordinates = async () => {
      // Get coordinates for each unique location.
      const coordPromises = locationsArr.map(loc => geocodeLocation(loc));
      const coordsResults = await Promise.all(coordPromises);

      locationsArr.forEach((loc, index) => {
        const coords = coordsResults[index];
        if (coords) {
          locationToCoords[loc] = coords;
        }
      });

      // Build an array of marker features from each click.
      // Even if multiple clicks share the same location, each click becomes its own feature.
      const featuresArray = clicks
        .map((click, index) => {
          const loc = `${click.city}, ${click.region}, ${click.country}, ${click.postal}`;
          const coords = locationToCoords[loc];
          if (coords) {
            return {
              id: index,
              coordinates: coords,
            } as MarkerFeature;
          }
          return null;
        })
        .filter((f): f is MarkerFeature => f !== null);

      setData({ features: featuresArray });
    };

    fetchAllCoordinates();
  }, [clicks]);

  return data;
}