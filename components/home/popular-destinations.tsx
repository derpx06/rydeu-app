import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

interface Destination {
  name: string;
  image: string;
  rides: string;
  time: string;
}

const destinations: Destination[] = [
  { 
    name: 'Berlin', 
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=90', 
    rides: '1.2k rides today',
    time: '15 min away' 
  },
  { 
    name: 'London', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=90', 
    rides: '2.8k rides today',
    time: '8 min away' 
  },
  { 
    name: 'Paris', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=90', 
    rides: '3.1k rides today',
    time: '12 min away' 
  },
  { 
    name: 'New York', 
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=90', 
    rides: '4.5k rides today',
    time: '22 min away' 
  },
  { 
    name: 'Dubai', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=90', 
    rides: '980 rides today',
    time: '18 min away' 
  },
  { 
    name: 'Tokyo', 
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=90', 
    rides: '2.1k rides today',
    time: '25 min away' 
  },
];

export function PopularDestinations() {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <AppText style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Popular Destinations
        </AppText>
        <TouchableOpacity activeOpacity={0.7}>
          <AppText style={[styles.seeAll, { color: theme.brand.primary }]}>Explore All →</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationsScroll}
        snapToInterval={192}
        decelerationRate="fast"
      >
        {destinations.map((city, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.destinationCard,
              { backgroundColor: theme.bg.surface },
            ]}
            activeOpacity={0.9}
            onPress={() => {
              console.log(`Selected destination: ${city.name}`);
              // TODO: Auto-fill dropoff location
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: city.image }}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              
              {/* Premium Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
                style={styles.gradientOverlay}
              />

              {/* Popular Badge */}
              <View style={styles.popularBadge}>
                <AppText style={styles.popularText}>TRENDING</AppText>
              </View>
            </View>

            <View style={styles.destinationInfo}>
              <AppText style={[styles.destinationName, { color: theme.text.primary }]}>
                {city.name}
              </AppText>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={theme.text.secondary} />
                  <AppText style={[styles.metaText, { color: theme.text.secondary }]}>
                    {city.time}
                  </AppText>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="car-outline" size={14} color={theme.text.secondary} />
                  <AppText style={[styles.metaText, { color: theme.text.secondary }]}>
                    {city.rides}
                  </AppText>
                </View>
              </View>

              <TouchableOpacity style={styles.bookNowButton} activeOpacity={0.8}>
                <AppText style={styles.bookNowText}>Book Ride →</AppText>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '600',
  },
  destinationsScroll: {
    paddingRight: 20,
    paddingVertical: 20,
    gap: 16,
  },
  destinationCard: {
    width: 192,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 168,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  popularBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FACC15',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  destinationInfo: {
    padding: 16,
    gap: 10,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bookNowButton: {
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
});