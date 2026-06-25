import { View, StyleSheet } from 'react-native';

/**
 * Custom premium map markers.
 * Pickup: white pulsing circle with dark dot.
 * Destination: solid dark teardrop pin.
 */
export function PickupMarker() {
  return (
    <View style={styles.pickupOuter}>
      <View style={styles.pickupInner} />
    </View>
  );
}

export function DestinationMarker() {
  return (
    <View style={styles.destinationWrap}>
      <View style={styles.destinationPin}>
        <View style={styles.destinationDot} />
      </View>
      <View style={styles.destinationStem} />
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Pickup ───────────────────────────────────────────────────────────────────
  pickupOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0F172A',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },

  // ── Destination ──────────────────────────────────────────────────────────────
  destinationWrap: {
    alignItems: 'center',
  },
  destinationPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  destinationStem: {
    width: 3,
    height: 10,
    backgroundColor: '#0F172A',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
});
