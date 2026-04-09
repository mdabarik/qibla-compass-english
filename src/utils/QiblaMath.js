export const KAABA_LAT = 21.422487;
export const KAABA_LON = 39.826206;

/**
 * Calculates the Qibla bearing in degrees from true North,
 * given the user's latitude and longitude in degrees.
 */
export function calculateQiblaBearing(userLat, userLon) {
  // Convert latitude and longitude to radians
  const lat1 = userLat * (Math.PI / 180);
  const lon1 = userLon * (Math.PI / 180);

  const lat2 = KAABA_LAT * (Math.PI / 180);
  const lon2 = KAABA_LON * (Math.PI / 180);

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = Math.atan2(y, x) * (180 / Math.PI);

  // Normalize to 0-360
  if (bearing < 0) {
    bearing += 360;
  }

  return bearing;
}
