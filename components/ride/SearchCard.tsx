import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { useAppSelector } from '@/store';

type Props = {
  onPickupPress: () => void;
  onDestinationPress: () => void;
};

/**
 * Premium floating glass search card with dynamic light/dark mode
 */
export function SearchCard({ onPickupPress, onDestinationPress }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const pickup = useAppSelector((s) => s.ride.pickup);
  const destination = useAppSelector((s) => s.ride.destination);

  const isDark = theme.bg.app === '#000000' || theme.bg.app === '#0F172A';

  return (
    <View
      style={[
        styles.card,
        {
          top: insets.top + 12,
          backgroundColor: isDark 
            ? 'rgba(15, 23, 42, 0.85)'   // Dark glass
            : 'rgba(255, 255, 255, 0.92)', // Light glass
          borderColor: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Pickup row */}
      <TouchableOpacity style={styles.row} onPress={onPickupPress} activeOpacity={0.75}>
        <View style={[styles.dotPickup, { backgroundColor: isDark ? '#22C55E' : '#0F172A' }]} />
        
        <View style={styles.textWrap}>
          {pickup ? (
            <>
              <AppText style={[styles.label, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                PICKUP
              </AppText>
              <AppText style={[styles.value, { color: isDark ? '#F1F5F9' : '#0F172A' }]} numberOfLines={1}>
                {pickup.name}
              </AppText>
            </>
          ) : (
            <AppText style={[styles.placeholder, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Set pickup location…
            </AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* Connecting line */}
      <View style={styles.connector}>
        <View style={[styles.connectorLine, { backgroundColor: isDark ? '#475569' : '#E2E8F0' }]} />
      </View>

      {/* Destination row */}
      <TouchableOpacity style={styles.row} onPress={onDestinationPress} activeOpacity={0.75}>
        <View style={[styles.dotDestination, { backgroundColor: isDark ? '#EF4444' : '#0F172A' }]} />
        
        <View style={styles.textWrap}>
          {destination ? (
            <>
              <AppText style={[styles.label, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                DESTINATION
              </AppText>
              <AppText style={[styles.value, { color: isDark ? '#F1F5F9' : '#0F172A' }]} numberOfLines={1}>
                {destination.name}
              </AppText>
            </>
          ) : (
            <AppText style={[styles.placeholder, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Where to?
            </AppText>
          )}
        </View>

        <Ionicons 
          name="search" 
          size={20} 
          color={isDark ? '#94A3B8' : '#64748B'} 
          style={{ marginLeft: 'auto' }} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    // Premium glass shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 15,
    zIndex: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    gap: 14,
  },
  connector: {
    paddingLeft: 8,
    paddingVertical: 3,
  },
  connectorLine: {
    width: 2,
    height: 18,
    borderRadius: 2,
  },
  dotPickup: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  dotDestination: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 1,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
  },
});