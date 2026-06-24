import { Ionicons } from '@expo/vector-icons';
import moment, { Moment } from 'moment';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppText } from '@/components/ui/app-text';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import { useAppTheme } from '@/constants/app-theme';

type PickerMode = 'date' | 'time';

type CalendarDay = {
  key: string;
  date: Moment;
  inMonth: boolean;
};

type DateTimePickerSheetProps = {
  value?: string;
  onChange: (isoString: string) => void;
  monthsToShow?: number;
  minDate?: string | Date | Moment;
};

const weekdays = moment.weekdaysShort();
const timePresets = [
  { label: '09:00', hour: 9, minute: 0 },
  { label: '12:30', hour: 12, minute: 30 },
  { label: '18:00', hour: 18, minute: 0 },
  { label: '21:00', hour: 21, minute: 0 },
];

const buildMonthDays = (month: Moment) => {
  const start = month.clone().startOf('month').startOf('week');
  const end = month.clone().endOf('month').endOf('week');
  const days: CalendarDay[] = [];
  const cursor = start.clone();

  while (cursor.isSameOrBefore(end, 'day')) {
    days.push({
      key: cursor.format('YYYY-MM-DD'),
      date: cursor.clone(),
      inMonth: cursor.isSame(month, 'month'),
    });
    cursor.add(1, 'day');
  }

  return days;
};

const normalizeMinDate = (minDate?: string | Date | Moment) =>
  minDate ? moment(minDate).startOf('day') : moment().startOf('day');

export function DateTimePickerSheet({
  value,
  onChange,
  monthsToShow = 6,
  minDate,
}: DateTimePickerSheetProps) {
  const theme = useAppTheme();
  const minimumDate = useMemo(() => normalizeMinDate(minDate), [minDate]);
  const initial = useMemo(() => {
    const parsed = value ? moment(value) : moment();
    return parsed.isBefore(minimumDate) ? minimumDate.clone().hour(moment().hour()).minute(moment().minute()) : parsed;
  }, [minimumDate, value]);
  const [selected, setSelected] = useState(initial);
  const [mode, setMode] = useState<PickerMode>('date');

  const months = useMemo(
    () => Array.from({ length: monthsToShow }, (_, index) => minimumDate.clone().startOf('month').add(index, 'month')),
    [minimumDate, monthsToShow],
  );

  const updateTime = (unit: 'hour' | 'minute', amount: number) => {
    setSelected((current) => current.clone().add(amount, unit));
  };

  const selectTime = (hour: number, minute: number) => {
    setSelected((current) => current.clone().hour(hour).minute(minute).second(0).millisecond(0));
  };

  const selectDate = (date: Moment) => {
    if (date.isBefore(minimumDate, 'day')) return;
    setSelected((current) =>
      date
        .clone()
        .hour(current.hour())
        .minute(current.minute())
        .second(0)
        .millisecond(0),
    );
  };

  const confirm = () => {
    onChange(selected.clone().second(0).millisecond(0).toISOString());
    SheetManager.close();
  };

  return (
    <View style={styles.container}>
      <AppCard style={[styles.summary, { backgroundColor: theme.bg.surface }]}>
        <View>
          <AppText variant="caption" style={{ color: theme.text.secondary }}>
            Selected date and time
          </AppText>
          <AppText variant="subtitle">{selected.format('ddd, DD MMM YYYY')}</AppText>
        </View>
        <AppText variant="title" style={{ color: theme.brand.primary }}>
          {selected.format('hh:mm A')}
        </AppText>
      </AppCard>

      <SegmentedTabs
        tabs={[
          { label: 'Date', value: 'date' },
          { label: 'Time', value: 'time' },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === 'date' ? (
        <View style={styles.months}>
          {months.map((month) => (
            <View key={month.format('YYYY-MM')} style={styles.monthBlock}>
              <AppText variant="label" style={styles.monthTitle}>
                {month.format('MMMM YYYY')}
              </AppText>
              <View style={styles.weekdayRow}>
                {weekdays.map((day) => (
                  <AppText
                    key={day}
                    variant="caption"
                    style={[styles.weekday, { color: theme.text.secondary }]}>
                    {day}
                  </AppText>
                ))}
              </View>
              <View style={styles.dayGrid}>
                {buildMonthDays(month).map((day) => {
                  const isSelected = day.date.isSame(selected, 'day');
                  const isDisabled = day.date.isBefore(minimumDate, 'day');
                  const isToday = day.date.isSame(moment(), 'day');

                  return (
                    <Pressable
                      key={day.key}
                      disabled={isDisabled}
                      onPress={() => selectDate(day.date)}
                      style={[
                        styles.dayCell,
                        isSelected && { backgroundColor: theme.brand.primary },
                        isToday && !isSelected && { borderColor: theme.brand.primary, borderWidth: 1 },
                      ]}>
                      <AppText
                        variant="caption"
                        style={[
                          styles.dayText,
                          {
                            color: isSelected
                              ? theme.text.inverse
                              : day.inMonth
                                ? theme.text.primary
                                : theme.text.placeholder,
                            opacity: isDisabled ? 0.32 : 1,
                          },
                        ]}>
                        {day.date.format('D')}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.timePanel}>
          <View style={styles.presetRow}>
            {timePresets.map((preset) => {
              const isSelected = selected.hour() === preset.hour && selected.minute() === preset.minute;

              return (
                <Pressable
                  key={preset.label}
                  onPress={() => selectTime(preset.hour, preset.minute)}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isSelected ? theme.brand.primary : theme.bg.surface,
                      borderColor: isSelected ? theme.brand.primary : theme.border.default,
                    },
                  ]}>
                  <AppText
                    variant="label"
                    style={{ color: isSelected ? theme.text.inverse : theme.text.primary }}>
                    {preset.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <TimeStepper
            label="Hour"
            value={selected.format('hh')}
            onDecrease={() => updateTime('hour', -1)}
            onIncrease={() => updateTime('hour', 1)}
          />
          <TimeStepper
            label="Minute"
            value={selected.format('mm')}
            onDecrease={() => updateTime('minute', -5)}
            onIncrease={() => updateTime('minute', 5)}
          />
          <Pressable
            onPress={() => updateTime('hour', 12)}
            style={[styles.ampm, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
            <AppText variant="caption" style={{ color: theme.text.secondary }}>
              Period
            </AppText>
            <AppText variant="label" style={{ color: theme.brand.primary }}>
              {selected.format('A')}
            </AppText>
          </Pressable>
        </View>
      )}

      <View style={styles.actions}>
        <AppButton title="Cancel" variant="secondary" onPress={() => SheetManager.close()} style={styles.actionButton} />
        <AppButton title="Confirm" icon="checkmark" onPress={confirm} style={styles.actionButton} />
      </View>
    </View>
  );
}

function TimeStepper({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.stepper, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
      <AppText variant="caption" style={{ color: theme.text.secondary }}>
        {label}
      </AppText>
      <View style={styles.stepperRow}>
        <Pressable onPress={onDecrease} hitSlop={10}>
          <Ionicons name="remove-circle-outline" size={28} color={theme.brand.primary} />
        </Pressable>
        <AppText variant="title" style={styles.stepperValue}>
          {value}
        </AppText>
        <Pressable onPress={onIncrease} hitSlop={10}>
          <Ionicons name="add-circle-outline" size={28} color={theme.brand.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summary: {
    gap: 12,
  },
  months: {
    gap: 18,
  },
  monthBlock: {
    gap: 10,
  },
  monthTitle: {
    textAlign: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
  timePanel: {
    gap: 12,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    minHeight: 40,
    minWidth: 76,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  stepper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperValue: {
    minWidth: 80,
    textAlign: 'center',
  },
  ampm: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
