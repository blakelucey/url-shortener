// staticGeoData.ts
export const staticGeoData = {
  features: Array.from({ length: 100 }, (_, i) => {
    // Create a 10x10 grid.
    const col = i % 10;
    const row = Math.floor(i / 10);
    const baseLon = -91.2423657;
    const baseLat = 39.8169907;
    // Small increments so that points are near each other.
    const lon = baseLon + col * 0.005;
    const lat = baseLat + row * 0.005;
    return {
      id: i,
      coordinates: [lat, lon], // Note: Leaflet uses [lat, lng] order.
    };
  }),
};