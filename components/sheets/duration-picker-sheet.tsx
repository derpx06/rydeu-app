import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { useBottomSheet, useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const MID_INDEX = Math.floor(VISIBLE_ITEMS / 2);

type DurationPickerSheetProps = {
  value?: { hours: number; minutes: number };
  onChange: (duration: { hours: number; minutes: number }) => void;
};

export function DurationPickerSheet({ value, onChange }: DurationPickerSheetProps) {
  const theme = useAppTheme();
  const sheetId = useSheetId();
  const { updateSheet, closeSheet } = useBottomSheet();

  const initialHours = value?.hours ?? 2;

  const [selectedHour, setSelectedHour] = useState(initialHours);

  const hours = useMemo(() => Array.from({ length: 25 }, (_, i) => i), []);

  const hourScrollRef = useRef<ScrollView>(null);

  const onConfirm = useCallback(() => {
    let h = selectedHour;
    if (h === 0) {
      h = 1;
    }
    onChange({ hours: h, minutes: 0 });
    closeSheet(sheetId || undefined);
  }, [selectedHour, onChange, closeSheet, sheetId]);

  useEffect(() => {
    if (sheetId) {
      updateSheet(sheetId, {
        onSubmitPress: onConfirm,
        submitLabel: 'Set Duration',
        enableScroll: false,
      });
    }
  }, [sheetId, onConfirm, updateSheet]);

  const handleScrollTo = (val: number, animated = true) => {
    setSelectedHour(val);
    hourScrollRef.current?.scrollTo({ y: val * ITEM_HEIGHT, animated });
  };

  const increment = () => {
    const next = (selectedHour + 1) % 25;
    handleScrollTo(next);
  };

  const decrement = () => {
    const next = (selectedHour - 1 + 25) % 25;
    handleScrollTo(next);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const hourIndex = hours.indexOf(selectedHour);
      if (hourIndex !== -1 && hourScrollRef.current) {
        hourScrollRef.current.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedHour, hours]);

  const renderPickerColumn = (
    data: number[],
    selected: number,
    ref: React.RefObject<ScrollView | null>,
    unit: string
  ) => (
    <View style={styles.columnContainer}>
      <TouchableOpacity style={styles.stepBtn} onPress={decrement}>
        <Ionicons name="chevron-up" size={20} color={theme.brand.primary} />
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
              setSelectedHour(val);
            }
          }}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * MID_INDEX,
          }}
        >
          {data.map((item) => {
            const isSelected = selected === item;
            const label = item === 1 && unit === 'hr' ? 'hr' : unit === 'hr' ? 'hrs' : 'min';
            return (
              <TouchableOpacity 
                key={item} 
                style={[styles.item, { height: ITEM_HEIGHT }]}
                onPress={() => handleScrollTo(item)}
                activeOpacity={0.7}
              >
                <AppText
                  style={[
                    styles.itemText,
                    {
                      color: isSelected ? theme.brand.primary : theme.text.placeholder,
                      opacity: isSelected ? 1 : 0.4,
                      fontSize: isSelected ? 22 : 16,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.toString().padStart(2, '0')} {label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.stepBtn} onPress={increment}>
        <Ionicons name="chevron-down" size={20} color={theme.brand.primary} />
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
            }
          ]}
        />
        
        <View style={styles.pickerContent}>
          {renderPickerColumn(hours, selectedHour, hourScrollRef, 'hr')}
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
    width: '62%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
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
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
