import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

type UseCurrentLocationResult = {
  coords: CurrentLocation | null;
  loading: boolean;
  permissionDenied: boolean;
  error: string | null;
  retry: () => void;
};

export function useCurrentLocation(): UseCurrentLocationResult {
  const [coords, setCoords] = useState<CurrentLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      try {
        // Check permission first to avoid Android hanging bug
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const res = await Location.requestForegroundPermissionsAsync();
          status = res.status;
        }

        if (status !== 'granted') {
          if (!cancelled) {
            setPermissionDenied(true);
            setLoading(false);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });

        // Reverse geocode to get address
        let address = 'Current Location';
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if (reverseGeocode && reverseGeocode.length > 0) {
            const locationData = reverseGeocode[0];
            address = locationData.formattedAddress || 
                      `${locationData.street || ''}, ${locationData.city || ''}`.trim() ||
                      'Current Location';
          }
        } catch (geocodeError) {
          // If reverse geocoding fails, use default
          console.warn('Reverse geocoding failed:', geocodeError);
        }

        if (!cancelled) {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address,
          });
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Failed to get location');
          setLoading(false);
        }
      }
    }

    fetchLocation();
    return () => { cancelled = true; };
  }, [tick]);

  return { coords, loading, permissionDenied, error, retry };
}
