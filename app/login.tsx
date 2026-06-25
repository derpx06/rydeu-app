import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { clearAuthError, login } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const emailError = submitted && !emailPattern.test(email.trim()) ? 'Enter a valid email address.' : null;
  const passwordError = submitted && password.length < 6 ? 'Password must be at least 6 characters.' : null;

  const handleLogin = async () => {
    setSubmitted(true);
    dispatch(clearAuthError());

    if (!emailPattern.test(email.trim()) || password.length < 6) return;

    const result = await dispatch(login({ 
      email: email.trim(), 
      password, 
      type: 'customer' 
    }));
    if (login.fulfilled.match(result)) {
      router.replace('/');
    }
  };

  const handleGuest = async () => {
    const result = await dispatch(login({ 
      email: 'rydeu@email10p.org', 
      password: '123456', 
      type: 'customer' 
    }));
    if (login.fulfilled.match(result)) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <AppText variant="title" style={styles.welcomeTitle}>
              Welcome to Rydeu
            </AppText>
            <AppText style={styles.welcomeSubtitle}>
              Your smooth ride between airport and city starts here
            </AppText>
          </View>

          {/* Red Accent Line with Cars */}
          <View style={styles.accentLine}>
            <View style={styles.redLine} />
            <View style={styles.carsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="car" size={16} color="#000000" style={styles.carIcon} />
              ))}
            </View>
            <View style={styles.redLine} />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <AppInput
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              error={emailError}
              placeholder="Enter your email"
            />
            <AppInput
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              error={passwordError}
              placeholder="Enter your password"
            />
            {error ? (
              <AppText variant="caption" style={{ color: theme.status.error }}>
                {error}
              </AppText>
            ) : null}
            
            <AppButton 
              title="Sign In" 
              loading={loading} 
              onPress={handleLogin}
              backgroundColor="#E31837"
              style={styles.button}
            />
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <AppText style={styles.dividerText}>or</AppText>
              <View style={styles.dividerLine} />
            </View>
            
            <AppButton
              title="Continue as Guest"
              onPress={handleGuest}
              backgroundColor="#000000"
              style={styles.button}
            />
          </View>

          {/* Decorative Image at Bottom */}
          <View style={styles.imageSection}>
            <Image 
              source={require('@/assets/images/login.png')} 
              style={styles.loginImage}
              resizeMode="cover"
            />
          </View>

          {/* Footer Text */}
          <View style={styles.footer}>
            <AppText style={styles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </AppText>
          </View>
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
    padding: 24,
    justifyContent: 'flex-start',
    gap: 24,
  },
  imageSection: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  loginImage: {
    width: '100%',
    height: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeSection: {
    alignItems: 'center',
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  accentLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  redLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E31837',
  },
  carsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  carIcon: {
    opacity: 0.7,
  },
  formSection: {
    gap: 16,
    marginTop: 8,
  },
  button: {
    height: 60,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 12,
    color: '#999999',
  },
  footer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
