import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import { memo } from 'react';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

interface HeroSectionProps {
  displayName: string;
}

export const HeroSection = memo(function HeroSection({ displayName }: HeroSectionProps) {
  const theme = useAppTheme();
  const isDark = theme.bg.app === '#000000';
  const heroTextColor = isDark ? '#FFFFFF' : '#0F172A';
  const heroSubColor = isDark ? 'rgba(255, 255, 255, 0.65)' : '#64748B';

  return (
    <View style={[styles.heroSection, { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16 }]}>
      <View style={styles.heroRow}>
        <View style={styles.heroLeft}>
          <View style={[styles.greetingBadge, { backgroundColor: `${theme.brand.primary}20` }]}>
            <AppText style={[styles.greetingBadgeText, { color: theme.brand.primary }]}>Welcome back</AppText>
          </View>
          <AppText style={[styles.greetingText, { color: heroTextColor }]}>Hello, {displayName}! 👋</AppText>
          <AppText style={[styles.subText, { color: heroSubColor }]}>
            Book airport transfers, hourly rides, and long-distance chauffeur services worldwide.
          </AppText>
        </View>
        <View style={styles.heroRight}>
          <Image
            source={require('@/assets/images/3d-car.png')}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  heroSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 110,
  },
  heroLeft: {
    flex: 1.25,
    paddingRight: 6,
  },
  greetingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  greetingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  heroRight: {
    flex: 0.75,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  carImage: {
    width: 140,
    height: 200,
  },
});
