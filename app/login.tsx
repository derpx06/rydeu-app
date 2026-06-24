import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppInput } from '@/components/ui/app-input';
import { AppText } from '@/components/ui/app-text';
import { GradientBackground } from '@/components/ui/gradient-background';
import { useAppTheme } from '@/constants/app-theme';
import { clearAuthError, login } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('rydeu@email10p.org');
  const [submitted, setSubmitted] = useState(false);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const emailError = submitted && !emailPattern.test(email.trim()) ? 'Enter a valid email address.' : null;

  const handleLogin = async () => {
    setSubmitted(true);
    dispatch(clearAuthError());

    if (!emailPattern.test(email.trim())) return;

    const result = await dispatch(login({ email: email.trim() }));
    if (login.fulfilled.match(result)) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg.app }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <GradientBackground style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View style={styles.brandMark}>
                <Ionicons name="car-sport" size={30} color={theme.text.inverse} />
              </View>
              <AppText variant="label" style={styles.brandText}>
                Rydeu
              </AppText>
            </View>
            <View style={styles.heroCopy}>
              <AppText variant="title" style={styles.heroTitle}>
                Plan your pickup
              </AppText>
              <AppText style={styles.heroDescription}>
                Sign in to schedule a customer ride with a custom date and time picker.
              </AppText>
            </View>
          </GradientBackground>

          <AppCard style={styles.formCard}>
            <View style={styles.formHeader}>
              <AppText variant="subtitle">Welcome back</AppText>
              <AppText style={{ color: theme.text.secondary }}>
                Enter an email to continue with a local demo session.
              </AppText>
            </View>

            <AppInput
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              error={emailError}
            />

            {error ? (
              <AppText variant="caption" style={{ color: theme.status.error }}>
                {error}
              </AppText>
            ) : null}

            <AppButton title="Login" icon="log-in-outline" loading={loading} onPress={handleLogin} />
          </AppCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 18,
  },
  hero: {
    minHeight: 220,
    borderRadius: 8,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: 'rgba(255, 255, 255, 0.84)',
  },
  heroCopy: {
    gap: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  formCard: {
    gap: 16,
  },
  formHeader: {
    gap: 4,
  },
});
