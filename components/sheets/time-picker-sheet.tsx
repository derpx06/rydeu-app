import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useBottomSheet, useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const MID_INDEX = Math.floor(VISIBLE_ITEMS / 2);

type TimePickerSheetProps = {
  value?: string;
  onChange: (isoString: string) => void;
};

export function TimePickerSheet({ value, onChange }: TimePickerSheetProps) {
  const theme = useAppTheme();
  const sheetId = useSheetId();
  const { updateSheet, closeSheet } = useBottomSheet();
  
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

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  const onConfirm = useCallback(() => {
    let h24 = hour12;
    if (amPm === 'PM' && hour12 < 12) h24 += 12;
    if (amPm === 'AM' && hour12 === 12) h24 = 0;

    const nextValue = moment(value || undefined).hour(h24).minute(minute).second(0).millisecond(0);
    onChange(nextValue.toISOString());
    closeSheet(sheetId || undefined);
  }, [hour12, minute, amPm, value, onChange, sheetId, closeSheet]);

  useEffect(() => {
    if (sheetId) {
      updateSheet(sheetId, {
        onSubmitPress: onConfirm,
        submitLabel: 'Set Time',
        enableScroll: false,
      });
    }
  }, [sheetId, onConfirm, updateSheet]);

  // Handle initial scroll only once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const hIndex = hours.indexOf(hour12);
      if (hIndex !== -1) {
        hourScrollRef.current?.scrollTo({ y: hIndex * ITEM_HEIGHT, animated: false });
      }
      minuteScrollRef.current?.scrollTo({ y: minute * ITEM_HEIGHT, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToValue = useCallback((type: 'hour' | 'minute', val: number) => {
    if (type === 'hour') {
      setHour12(val);
      const index = hours.indexOf(val);
      if (index !== -1) {
        hourScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
      }
    } else {
      setMinute(val);
      minuteScrollRef.current?.scrollTo({ y: val * ITEM_HEIGHT, animated: true });
    }
  }, [hours]);

  const increment = (type: 'hour' | 'minute') => {
    if (type === 'hour') {
      const next = hour12 === 12 ? 1 : hour12 + 1;
      scrollToValue('hour', next);
    } else {
      const next = (minute + 1) % 60;
      scrollToValue('minute', next);
    }
  };

  const decrement = (type: 'hour' | 'minute') => {
    if (type === 'hour') {
      const next = hour12 === 1 ? 12 : hour12 - 1;
      scrollToValue('hour', next);
    } else {
      const next = (minute - 1 + 60) % 60;
      scrollToValue('minute', next);
    }
  };

  const renderPickerColumn = (
    type: 'hour' | 'minute',
    data: number[],
    selected: number,
    ref: React.RefObject<ScrollView | null>
  ) => (
    <View style={styles.columnContainer}>
      <TouchableOpacity style={styles.stepBtn} onPress={() => decrement(type)} activeOpacity={0.7}>
        <Ionicons name="chevron-up" size={22} color={theme.brand.primary} />
      </TouchableOpacity>

      <View style={styles.scrollBox}>
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const y = event.nativeEvent.contentOffset.y;
            const index = Math.round(y / ITEM_HEIGHT);
            const val = data[index];
            if (val !== undefined && val !== selected) {
              if (type === 'hour') setHour12(val);
              else setMinute(val);
            }
          }}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * MID_INDEX,
          }}
        >
          {data.map((item) => {
            const isSelected = selected === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.item, { height: ITEM_HEIGHT }]}
                onPress={() => scrollToValue(type, item)}
                activeOpacity={0.7}
              >
                <AppText
                  style={[
                    styles.itemText,
                    {
                      color: isSelected ? theme.brand.primary : theme.text.placeholder,
                      opacity: isSelected ? 1 : 0.42,
                      fontSize: isSelected ? 24 : 17,
                      fontWeight: isSelected ? '800' : '500',
                    },
                  ]}
                >
                  {item.toString().padStart(2, '0')}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.stepBtn} onPress={() => increment(type)} activeOpacity={0.7}>
        <Ionicons name="chevron-down" size={22} color={theme.brand.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { height: (ITEM_HEIGHT * VISIBLE_ITEMS) + 80, backgroundColor: theme.bg.app }]}>
      <View style={styles.pickerWrapper}>
        <View
          pointerEvents="none"
          style={[
            styles.selectionOverlay,
            {
              height: ITEM_HEIGHT,
              top: (ITEM_HEIGHT * MID_INDEX) + 40,
              backgroundColor: theme.bg.surface,
              borderColor: theme.brand.primary,
              borderWidth: 2,
            },
          ]}
        />

        <View style={styles.pickerContent}>
          {renderPickerColumn('hour', hours, hour12, hourScrollRef)}
          <AppText style={[styles.separator, { color: theme.text.primary }]}>:</AppText>
          {renderPickerColumn('minute', minutes, minute, minuteScrollRef)}
        </View>

        <View style={styles.amPmColumn}>
          <TouchableOpacity
            style={[
              styles.amPmBtn,
              { 
                backgroundColor: amPm === 'AM' ? theme.brand.primary : theme.bg.surface, 
                borderColor: amPm === 'AM' ? theme.brand.primary : theme.border.default 
              }
            ]}
            onPress={() => setAmPm('AM')}
            activeOpacity={0.8}
          >
            <AppText style={[styles.amPmText, { color: amPm === 'AM' ? '#FFF' : theme.text.secondary }]}>AM</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.amPmBtn,
              { 
                backgroundColor: amPm === 'PM' ? theme.brand.primary : theme.bg.surface, 
                borderColor: amPm === 'PM' ? theme.brand.primary : theme.border.default 
              }
            ]}
            onPress={() => setAmPm('PM')}
            activeOpacity={0.8}
          >
            <AppText style={[styles.amPmText, { color: amPm === 'PM' ? '#FFF' : theme.text.secondary }]}>PM</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginTop: -12,
  },
  pickerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pickerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  selectionOverlay: {
    position: 'absolute',
    left: 20,
    right: 86,
    borderRadius: 14,
    zIndex: 0,
  },
  columnContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBox: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
  },
  stepBtn: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    textAlign: 'center',
  },
  separator: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    width: 18,
    zIndex: 1,
  },
  amPmColumn: {
    width: 66,
    gap: 12,
    paddingRight: 10,
    marginLeft: 10,
  },
  amPmBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amPmText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
