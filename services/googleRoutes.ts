import { decode } from '@googlemaps/polyline-codec';
import { RouteInfo } from '@/store/rideSlice';

const KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY ?? '';

const ROUTES_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes';

export async function computeRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
): Promise<RouteInfo> {
  if (!KEY) {
    throw new Error('EXPO_PUBLIC_GOOGLE_KEY is not set. Route calculation requires a valid API key.');
  }

  const body = {
    origin: {
      location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } },
    },
    destination: {
      location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } },
    },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  };

  const response = await fetch(ROUTES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask':
        'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Google Routes API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error('No route found between the selected locations.');

  const encodedPolyline: string = route.polyline?.encodedPolyline ?? '';
  const distanceMeters: number = route.distanceMeters ?? 0;
  // duration comes back as "1234s" — strip the trailing "s"
  const rawDuration: string = route.duration ?? '0s';
  const durationSeconds = parseInt(rawDuration.replace('s', ''), 10) || 0;

  // Decode using @googlemaps/polyline-codec (precision 5 for standard Google polylines)
  const decoded = decode(encodedPolyline, 5);
  const coordinates = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

  return { encodedPolyline, coordinates, distanceMeters, durationSeconds };
}
