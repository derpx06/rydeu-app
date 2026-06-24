import 'react-native-reanimated';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { BottomSheetProvider } from '@/components/bottom-sheet/bottom-sheet-provider';
import { useAppTheme } from '@/constants/app-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { restoreSession } from '@/store/authSlice';
import { store, useAppDispatch, useAppSelector } from '@/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const hasRestoredSession = useAppSelector((state) => state.auth.hasRestoredSession);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (!hasRestoredSession) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.bg.app }]}>
        <ActivityIndicator color={theme.brand.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <BottomSheetProvider>
            <RootNavigator />
          </BottomSheetProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
