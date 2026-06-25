import { Redirect } from 'expo-router';

import { useAppSelector } from '@/store';

export default function RootRedirect() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasCompletedOnboarding = useAppSelector((state) => state.auth.hasCompletedOnboarding);

  // If authenticated, go directly to home screen regardless of onboarding
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If not authenticated and not completed onboarding, show onboarding
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Otherwise show login
  return <Redirect href="/login" />;
}
