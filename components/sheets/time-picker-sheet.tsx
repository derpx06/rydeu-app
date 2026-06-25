import moment from 'moment';
import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

type TimePickerSheetProps = {
  value?: string;
  onChange: (isoString: string) => void;
};

export function TimePickerSheet({ value, onChange }: TimePickerSheetProps) {
  const theme = useAppTheme();
  const sheetId = useSheetId();

  const initial = useMemo(() => moment(value || undefined), [value]);
  
  // Internal state for 12-hour format
  const [hour12, setHour12] = useState(() => {
    const h = initial.hour();
    if (h === 0) return 12;
    if (h > 12) return h - 12;
    return h;
  });
  const [minute, setMinute] = useState(initial.minute());
  const [amPm, setAmPm] = useState(initial.hour() >= 12 ? 'PM' : 'AM');

  const onConfirm = useCallback(() => {
    let h24 = hour12;
    if (amPm === 'PM' && hour12 < 12) h24 += 12;
    if (amPm === 'AM' && hour12 === 12) h24 = 0;

    const nextValue = moment(value || undefined).hour(h24).minute(minute).second(0).millisecond(0);
    onChange(nextValue.toISOString());
    SheetManager.close(sheetId || undefined);
  }, [hour12, minute, amPm, value, onChange, sheetId]);

  useEffect(() => {
    if (sheetId) {
      SheetManager.update(sheetId, {
        onSubmitPress: onConfirm,
        submitLabel: 'Set Time',
        enableScroll: false,
      });
    }
  }, [sheetId, onConfirm]);

  const adjustHour = (delta: number) => {
    setHour12(prev => {
      let next = prev + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const adjustMinute = (delta: number) => {
    setMinute(prev => {
      let next = prev + delta;
      if (next >= 60) return 0;
      if (next < 0) return 59;
      return next;
    });
  };

  const toggleAmPm = () => setAmPm(prev => prev === 'AM' ? 'PM' : 'AM');

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
      <View style={styles.pickerContent}>
        {/* Hour Column */}
        <View style={styles.column}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustHour(1)}>
            <Ionicons name="chevron-up" size={28} color={theme.brand.primary} />
          </TouchableOpacity>
          <View style={[styles.valueBox, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
            <AppText style={[styles.valueText, { color: theme.text.primary }]}>
              {hour12.toString().padStart(2, '0')}
            </AppText>
          </View>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustHour(-1)}>
            <Ionicons name="chevron-down" size={28} color={theme.brand.primary} />
          </TouchableOpacity>
        </View>

        <AppText style={[styles.separator, { color: theme.text.primary }]}>:</AppText>

        {/* Minute Column */}
        <View style={styles.column}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustMinute(1)}>
            <Ionicons name="chevron-up" size={28} color={theme.brand.primary} />
          </TouchableOpacity>
          <View style={[styles.valueBox, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
            <AppText style={[styles.valueText, { color: theme.text.primary }]}>
              {minute.toString().padStart(2, '0')}
            </AppText>
          </View>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjustMinute(-1)}>
            <Ionicons name="chevron-down" size={28} color={theme.brand.primary} />
          </TouchableOpacity>
        </View>

        {/* AM/PM Toggle */}
        <View style={styles.amPmColumn}>
          <TouchableOpacity 
            style={[
              styles.amPmBtn, 
              { backgroundColor: theme.bg.surface, borderColor: amPm === 'AM' ? theme.brand.primary : theme.border.default }
            ]} 
            onPress={() => setAmPm('AM')}
          >
            <AppText style={[styles.amPmText, { color: amPm === 'AM' ? theme.brand.primary : theme.text.secondary }]}>AM</AppText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.amPmBtn, 
              { backgroundColor: theme.bg.surface, borderColor: amPm === 'PM' ? theme.brand.primary : theme.border.default }
            ]} 
            onPress={() => setAmPm('PM')}
          >
            <AppText style={[styles.amPmText, { color: amPm === 'PM' ? theme.brand.primary : theme.text.secondary }]}>PM</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  column: {
    alignItems: 'center',
    gap: 10,
  },
  valueBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 34,
    fontWeight: '700',
  },
  stepBtn: {
    padding: 5,
  },
  separator: {
    fontSize: 34,
    fontWeight: '700',
    marginTop: -5,
  },
  amPmColumn: {
    gap: 10,
    marginLeft: 10,
  },
  amPmBtn: {
    width: 60,
    height: 45,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amPmText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
