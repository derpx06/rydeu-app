import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { computeFare } from '@/store/rideSlice';

type RideOption = {
  id: string;
  label: string;
};

type Props = {
  option: RideOption;
  distanceMeters: number;
  selected: boolean;
  onPress: () => void;
};

// Image mapping for different car types
const CAR_IMAGES: Record<string, string[]> = {
  'saloon': [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80', // BMW 5-series sedan
  ],
  'estate': [
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80', // BMW wagon
  ],
  'executive': [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80', // Mercedes Executive sedan
  ],
};

export function RideOptionCard({ option, distanceMeters, selected, onPress }: Props) {
  const theme = useAppTheme();
  const fare = computeFare(distanceMeters, option as any);

  const images = CAR_IMAGES[option.id.toLowerCase()] || [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80'
  ];

  const mainImage = images[0];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.bg.card,
          borderColor: selected ? theme.brand.primary : theme.border.default,
        },
        selected && styles.cardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Price Tag */}
      <View style={[styles.priceTag, { backgroundColor: theme.brand.primary }]}>
        <AppText style={styles.fare}>${fare.toFixed(0)}</AppText>
      </View>

      {/* Car Image */}
      <Image
        source={{ uri: mainImage }}
        style={styles.carImage}
        resizeMode="contain"
      />

      {/* Label Row */}
      <View style={styles.labelRow}>
        <AppText
          style={[
            styles.label,
            { color: theme.text.primary },
            selected && { color: theme.brand.primary }
          ]}
          numberOfLines={1}
        >
          {option.label}
        </AppText>

        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={theme.brand.primary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 155,
    height: 195,
    borderRadius: 22,
    borderWidth: 2,
    marginRight: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 12,
  },
  cardSelected: {
    borderWidth: 2.5,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 18,
    transform: [{ scale: 1.04 }],
  },
  priceTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 30,
    zIndex: 3,
  },
  fare: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  carImage: {
    width: '100%',
    height: 90,
    marginTop: 45,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  label: {
    fontSize: 15.5,
    fontWeight: '700',
    flex: 1,
  },
});
