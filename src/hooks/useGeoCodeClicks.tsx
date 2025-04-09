import { useAppSelector } from '@/store/hooks';
import { selectAllClicks } from '@/store/selectors/clickSelectors';
import React from 'react';

interface MarkerFeature {
  id: number | string;
  coordinates: [number, number]; // [lat, lng] order for Leaflet markers
}

interface MarkerFeatureCollection {
  features: MarkerFeature[];
}

export function useGeoCodedClicks(): MarkerFeatureCollection {
  const clicks = useAppSelector(selectAllClicks);

  const features = React.useMemo(() => {
    return clicks
      .filter(click => click.latitude != null && click.longitude != null)
      .map((click, index) => ({
        id: click._id || index, // or use another identifier if you prefer
        coordinates: [Number(click.latitude), Number(click.longitude)] as [number, number],
      }));
  }, [clicks]);

  return { features };
}