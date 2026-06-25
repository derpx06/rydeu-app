import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setRoute, setRouteLoading, setRouteError } from '@/store/rideSlice';
import { computeRoute } from '@/services/googleRoutes';

/**
 * Watches pickup + destination in rideSlice and automatically
 * calls the Google Routes API when both are present.
 * Debounced to avoid rapid-fire calls.
 */
export function useRoutes() {
  const dispatch = useAppDispatch();
  const pickup = useAppSelector((s) => s.ride.pickup);
  const destination = useAppSelector((s) => s.ride.destination);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pickup || !destination) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    dispatch(setRouteLoading(true));

    debounceRef.current = setTimeout(async () => {
      try {
        const route = await computeRoute(
          { latitude: pickup.latitude, longitude: pickup.longitude },
          { latitude: destination.latitude, longitude: destination.longitude },
        );
        dispatch(setRoute(route));
      } catch (e: any) {
        dispatch(setRouteError(e?.message ?? 'Could not calculate route.'));
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pickup, destination, dispatch]);
}
