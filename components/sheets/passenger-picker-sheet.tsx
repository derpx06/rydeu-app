import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, TouchableOpacity } from 'react-native';

import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { useBottomSheet, useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import type { PassengerCounts } from '@/store/calendarSlice';

type PassengerPickerSheetProps = {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
};

type StepperRowProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function StepperRow({ label, value, min = 0, max = 10, onDecrease, onIncrease }: StepperRowProps) {
  const theme = useAppTheme();
  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <View style={styles.stepperRow}>
      <AppText style={[styles.stepperLabel, { color: theme.text.primary }]}>{label}</AppText>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          onPress={onDecrease}
          disabled={isMin}
          style={[styles.stepperButton, { borderColor: theme.border.default }, isMin && { opacity: 0.3 }]}
          hitSlop={6}
        >
          <Ionicons name="remove" size={20} color={theme.text.primary} />
        </TouchableOpacity>
        <AppText style={[styles.stepperValue, { color: theme.text.primary }]}>{value}</AppText>
        <TouchableOpacity
          onPress={onIncrease}
          disabled={isMax}
          style={[styles.stepperButton, { borderColor: theme.border.default }, isMax && { opacity: 0.3 }]}
          hitSlop={6}
        >
          <Ionicons name="add" size={20} color={theme.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function PassengerPickerSheet({ value, onChange }: PassengerPickerSheetProps) {
  const theme = useAppTheme();
  const [counts, setCounts] = useState<PassengerCounts>({ ...value });

  const update = (key: keyof PassengerCounts, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(key === 'adults' ? 1 : 0, Math.min(10, prev[key] + delta)),
    }));
  };

  const handleDone = () => {
    onChange(counts);
    SheetManager.close();
  };

  const sheetId = useSheetId();
  const { updateSheet } = useBottomSheet();

  useEffect(() => {
    if (sheetId) {
      updateSheet(sheetId, {
        onSubmitPress: handleDone,
      });
    }
  }, [sheetId, counts]);

  const totalPassengers = counts.adults + counts.children;
  const totalBags = counts.smallBags + counts.largeBags;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
      <View style={[styles.summaryCapsule, { backgroundColor: theme.brand.primary + '15' }]}>
        <Ionicons name="people" size={20} color={theme.brand.primary} />
        <AppText style={[styles.summaryText, { color: theme.brand.primary }]}>
          {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
          {totalBags > 0 ? ` · ${totalBags} Bag${totalBags === 1 ? '' : 's'}` : ''}
        </AppText>
      </View>

      <View style={styles.stepperList}>
        <StepperRow
          label="Adults"
          value={counts.adults}
          min={1}
          onDecrease={() => update('adults', -1)}
          onIncrease={() => update('adults', 1)}
        />
        <View style={[styles.divider, { backgroundColor: theme.border.default }]} />
        <StepperRow
          label="Children"
          value={counts.children}
          onDecrease={() => update('children', -1)}
          onIncrease={() => update('children', 1)}
        />
        <View style={[styles.divider, { backgroundColor: theme.border.default }]} />
        <StepperRow
          label="Small/Cabin Bags"
          value={counts.smallBags}
          onDecrease={() => update('smallBags', -1)}
          onIncrease={() => update('smallBags', 1)}
        />
        <View style={[styles.divider, { backgroundColor: theme.border.default }]} />
        <StepperRow
          label="Large/Check-in Bags"
          value={counts.largeBags}
          onDecrease={() => update('largeBags', -1)}
          onIncrease={() => update('largeBags', 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  summaryCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepperList: {
    paddingHorizontal: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  stepperLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 5,
  },
});
