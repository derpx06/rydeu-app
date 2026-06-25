import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

interface Vehicle {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
  image: string;
  priceRange: string;
  capacity: string;
}

const vehicles: Vehicle[] = [
  { 
    name: 'Economy', 
    icon: 'car-outline', 
    desc: 'Reliable daily rides',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600', 
    priceRange: '€12-25',
    capacity: '4 passengers' 
  },
  { 
    name: 'Business', 
    icon: 'business-outline', 
    desc: 'Premium comfort',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600', 
    priceRange: '€25-45',
    capacity: '4 passengers' 
  },
  { 
    name: 'First Class', 
    icon: 'star-outline', 
    desc: 'Luxury experience',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600', 
    priceRange: '€45-80',
    capacity: '4 passengers' 
  },
  { 
    name: 'Van', 
    icon: 'bus-outline', 
    desc: 'Perfect for groups',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600', 
    priceRange: '€35-60',
    capacity: '8 passengers' 
  },
];

export function FleetSection() {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <AppText style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Our Fleet
        </AppText>
        <TouchableOpacity activeOpacity={0.7}>
          <AppText style={[styles.seeAll, { color: theme.brand.primary }]}>See All</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fleetContainer}
        snapToInterval={248}
        decelerationRate="fast"
      >
        {vehicles.map((vehicle, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.vehicleCard,
              { backgroundColor: theme.bg.surface },
            ]}
            activeOpacity={0.92}
            onPress={() => {
              // TODO: Open vehicle detail or pre-select for booking
              console.log(`Selected ${vehicle.name}`);
            }}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: vehicle.image }} 
                style={styles.vehicleImage} 
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              
              <View style={styles.iconBadge}>
                <Ionicons name={vehicle.icon} size={22} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.vehicleInfo}>
              <AppText style={[styles.vehicleName, { color: theme.text.primary }]}>
                {vehicle.name}
              </AppText>

              <AppText style={[styles.vehicleDesc, { color: theme.text.secondary }]}>
                {vehicle.desc}
              </AppText>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="cash-outline" size={14} color={theme.text.secondary} />
                  <AppText style={[styles.metaText, { color: theme.text.primary }]}>
                    {vehicle.priceRange}
                  </AppText>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color={theme.text.secondary} />
                  <AppText style={[styles.metaText, { color: theme.text.primary }]}>
                    {vehicle.capacity}
                  </AppText>
                </View>
              </View>
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
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '600',
  },
  fleetContainer: {
    paddingRight: 20,
    paddingVertical:10,
    gap: 16,
  },
  vehicleCard: {
    width: 248,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  imageContainer: {
    position: 'relative',
    height: 148,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  iconBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    padding: 16,
    gap: 8,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '700',
  },
  vehicleDesc: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
});