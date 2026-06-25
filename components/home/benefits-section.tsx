import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

interface Benefit {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}

const benefits: Benefit[] = [
  { 
    icon: 'person-outline', 
    title: 'Professional Chauffeurs', 
    desc: 'Experienced, vetted & background-checked drivers' 
  },
  { 
    icon: 'pricetag-outline', 
    title: 'Transparent Pricing', 
    desc: 'Fixed rates with no hidden fees or surprises' 
  },
  { 
    icon: 'time-outline', 
    title: '24/7 Availability', 
    desc: 'Book anytime — instant support always ready' 
  },
  { 
    icon: 'globe-outline', 
    title: 'Global Coverage', 
    desc: 'Premium rides in major cities worldwide' 
  },
];

export function BenefitsSection() {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <AppText style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Why Choose Rydeu
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.benefitsContainer}
        snapToInterval={272}
        decelerationRate="fast"
        pagingEnabled={false}
      >
        {benefits.map((benefit, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.benefitCard,
              { 
                backgroundColor: theme.bg.surface,
                shadowColor: theme.brand.primary,
              },
            ]}
            activeOpacity={0.92}
            onPress={() => {
              // Optional: Open detailed modal or navigate
              console.log(`Selected: ${benefit.title}`);
            }}
          >
            <View style={[styles.benefitIcon, { backgroundColor: `${theme.brand.primary}15` }]}>
              <Ionicons name={benefit.icon} size={28} color={theme.brand.primary} />
            </View>

            <AppText style={[styles.benefitTitle, { color: theme.text.primary }]}>
              {benefit.title}
            </AppText>

            <AppText style={[styles.benefitDesc, { color: theme.text.secondary }]}>
              {benefit.desc}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  benefitsContainer: {
    paddingRight: 20,
    gap: 16,
  },
  benefitCard: {
    width: 272,
    padding: 22,
    borderRadius: 22,
    
  },
  benefitIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 23,
  },
  benefitDesc: {
    fontSize: 14.5,
    lineHeight: 21,
  },
});