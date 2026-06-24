import { Redirect } from 'expo-router';

import { useAppSelector } from '@/store';

export default function RootRedirect() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
