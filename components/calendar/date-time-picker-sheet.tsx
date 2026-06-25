import { Ionicons } from '@expo/vector-icons';
import moment, { Moment } from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { TimePickerSheet } from '@/components/sheets/time-picker-sheet';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

type DateTimePickerSheetProps = {
  value?: string;
  onChange: (isoString: string) => void;
  minDate?: string | Date | Moment;
};

type ViewMode = 'calendar' | 'picker';

export function DateTimePickerSheet({ value, onChange, minDate }: DateTimePickerSheetProps) {
  const theme = useAppTheme();
  const sheetId = useSheetId();

  const minimumDate = useMemo(() => (minDate ? moment(minDate).startOf('day') : moment().startOf('day')), [minDate]);
  const initial = useMemo(() => {
    const parsed = value ? moment(value) : moment();
    return parsed.isBefore(minimumDate) ? minimumDate.clone() : parsed;
  }, [minimumDate, value]);

  const [selectedDate, setSelectedDate] = useState(initial.clone().startOf('day'));
  const [selectedHour, setSelectedHour] = useState(initial.hour());
  const [selectedMinute, setSelectedMinute] = useState(initial.minute());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.clone().startOf('month'));
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [pickerTab, setPickerTab] = useState<'month' | 'year'>('month');

  const confirm = useCallback(() => {
    const final = selectedDate.clone().hour(selectedHour).minute(selectedMinute).second(0).millisecond(0);
    onChange(final.toISOString());
    SheetManager.close(sheetId || undefined);
  }, [selectedDate, selectedHour, selectedMinute, onChange, sheetId]);

  useEffect(() => {
    if (sheetId) {
      SheetManager.update(sheetId, {
        onSubmitPress: viewMode === 'calendar' ? confirm : null,
        submitLabel: 'Save',
        snapPoints: ['85%'],
        enableScroll: viewMode === 'calendar',
      });
    }
  }, [sheetId, confirm, viewMode]);

  const handlePrevMonth = () => setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.clone().add(1, 'month'));

  const monthDays = useMemo(() => {
    const start = currentMonth.clone().startOf('month').startOf('week');
    const end = currentMonth.clone().endOf('month').endOf('week');
    const days = [];
    const cursor = start.clone();
    while (cursor.isSameOrBefore(end, 'day')) {
      days.push({ 
        key: cursor.format('YYYY-MM-DD'), 
        date: cursor.clone(), 
        inMonth: cursor.isSame(currentMonth, 'month') 
      });
      cursor.add(1, 'day');
    }
    return days;
  }, [currentMonth]);

  const handleQuickSelect = (type: 'tomorrow' | '3days' | '1week') => {
    let date = moment().startOf('day');
    if (type === 'tomorrow') date.add(1, 'day');
    else if (type === '3days') date.add(3, 'day');
    else if (type === '1week') date.add(7, 'day');
    setSelectedDate(date);
    setCurrentMonth(date.clone().startOf('month'));
  };

  const handleOpenTimePicker = () => {
    const currentTime = selectedDate.clone().hour(selectedHour).minute(selectedMinute).toISOString();
    SheetManager.open(
      <TimePickerSheet
        value={currentTime}
        onChange={(isoString) => {
          const m = moment(isoString);
          setSelectedHour(m.hour());
          setSelectedMinute(m.minute());
        }}
      />,
      { 
        title: 'Select Time', 
        snapPoints: ['55%'],
        enableScroll: false 
      }
    );
  };

  const months = moment.months();
  const years = useMemo(() => {
    const startYear = minimumDate.year();
    return Array.from({ length: 100 }, (_, i) => startYear + i);
  }, [minimumDate]);

  const selectMonth = (index: number) => {
    setCurrentMonth(prev => prev.clone().month(index));
  };

  const selectYear = (year: number) => {
    setCurrentMonth(prev => prev.clone().year(year));
  };

  if (viewMode === 'picker') {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
        <AppText style={[styles.pickerSubTitle, { color: theme.text.primary }]}>Select Month & Year</AppText>
        
        {/* Segmented control tab bar */}
        <View style={[styles.tabContainer, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
          <TouchableOpacity 
            style={[styles.tabButton, pickerTab === 'month' && { backgroundColor: theme.brand.primary }]}
            onPress={() => setPickerTab('month')}
            activeOpacity={0.8}
          >
            <AppText style={[styles.tabText, { color: pickerTab === 'month' ? '#FFF' : theme.text.primary }]}>Month</AppText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, pickerTab === 'year' && { backgroundColor: theme.brand.primary }]}
            onPress={() => setPickerTab('year')}
            activeOpacity={0.8}
          >
            <AppText style={[styles.tabText, { color: pickerTab === 'year' ? '#FFF' : theme.text.primary }]}>Year</AppText>
          </TouchableOpacity>
        </View>

        {pickerTab === 'month' ? (
          <View style={styles.grid}>
            {months.map((m, i) => {
              const isSelected = currentMonth.month() === i;
              return (
                <TouchableOpacity 
                  key={m} 
                  style={[
                    styles.gridItem, 
                    { 
                      borderColor: isSelected ? theme.brand.primary : theme.border.default,
                      backgroundColor: isSelected ? theme.brand.primary : 'transparent'
                    }
                  ]}
                  onPress={() => selectMonth(i)}
                >
                  <AppText style={[styles.gridText, { color: isSelected ? '#FFF' : theme.text.primary }]}>
                    {m.substring(0, 3)}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <FlatList
            data={years}
            keyExtractor={item => item.toString()}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              const isSelected = currentMonth.year() === item;
              return (
                <TouchableOpacity 
                  style={[
                    styles.yearItem, 
                    { 
                      borderBottomColor: theme.border.default,
                      backgroundColor: isSelected ? theme.brand.primary : 'transparent' 
                    }
                  ]}
                  onPress={() => selectYear(item)}
                >
                  <AppText style={[styles.yearText, { color: isSelected ? '#FFF' : theme.text.primary }]}>{item}</AppText>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.yearList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity 
          style={[styles.backBtn, { borderColor: theme.brand.primary }]} 
          onPress={() => setViewMode('calendar')}
          activeOpacity={0.7}
        >
          <AppText style={{ color: theme.brand.primary, fontWeight: '700', fontSize: 16 }}>Back to Calendar</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
      {/* Month Navigation */}
      <View style={[{ backgroundColor: theme.bg.surface, borderRadius: 16, paddingHorizontal: 10 }]}>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.bg.app }]} onPress={handlePrevMonth} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setViewMode('picker'); setPickerTab('month'); }}>
            <AppText style={[styles.monthTitle, { color: theme.text.primary }]}>
              {currentMonth.format('MMMM YYYY')} <Ionicons name="caret-down" size={14} />
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.bg.app }]} onPress={handleNextMonth} hitSlop={12}>
            <Ionicons name="chevron-forward" size={24} color={theme.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Weekdays Row */}
        <View style={styles.weekdaysRow}>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
            <AppText key={d} style={[styles.weekdayText, { color: theme.text.secondary }]}>{d}</AppText>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {monthDays.map((day) => {
            const isSelected = day.date.isSame(selectedDate, 'day');
            const isDisabled = day.date.isBefore(minimumDate, 'day');
            const isToday = day.date.isSame(moment(), 'day');
            return (
              <Pressable
                key={day.key}
                disabled={isDisabled}
                onPress={() => setSelectedDate(day.date)}
                style={[
                  styles.dayCell,
                  isSelected && styles.selectedDayCell,
                  isToday && !isSelected && styles.todayCell
                ]}
              >
                <AppText style={[
                  styles.dayText,
                  { 
                    color: isSelected ? '#FFF' : day.inMonth ? theme.text.primary : theme.text.placeholder,
                    opacity: isDisabled ? 0.2 : 1
                  }
                ]}>
                  {day.date.date()}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Quick Select Pills */}
      <View style={styles.quickSelectRow}>
        <TouchableOpacity 
          style={[styles.quickPill, { backgroundColor: theme.brand.primary + '15', borderColor: theme.brand.primary }]} 
          onPress={() => handleQuickSelect('tomorrow')}
        >
          <Ionicons name="calendar-outline" size={16} color={theme.brand.primary} />
          <AppText style={[styles.quickPillText, { color: theme.brand.primary }]}>Tomorrow</AppText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickPill, { backgroundColor: theme.brand.primary + '15', borderColor: theme.brand.primary }]} 
          onPress={() => handleQuickSelect('3days')}
        >
          <Ionicons name="time-outline" size={16} color={theme.brand.primary} />
          <AppText style={[styles.quickPillText, { color: theme.brand.primary }]}>In 3 days</AppText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickPill, { backgroundColor: theme.brand.primary + '15', borderColor: theme.brand.primary }]} 
          onPress={() => handleQuickSelect('1week')}
        >
          <Ionicons name="calendar-number-outline" size={16} color={theme.brand.primary} />
          <AppText style={[styles.quickPillText, { color: theme.brand.primary }]}>In 1 week</AppText>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border.default }]} />

      {/* Unified Time Section */}
      <View style={styles.timeSection}>
        <AppText style={[styles.timeLabel, { color: theme.text.primary }]}>Time</AppText>
        <TouchableOpacity onPress={handleOpenTimePicker} activeOpacity={0.7}>
          <View style={styles.timeControlRow}>
            <View style={[styles.timeBox, { borderColor: theme.brand.primary, backgroundColor: theme.brand.primary + '10' }]}>
              <AppText style={[styles.timeBoxText, { color: theme.brand.primary }]}>{selectedHour.toString().padStart(2, '0')}</AppText>
            </View>
            <AppText style={[styles.colon, { color: theme.text.primary }]}>:</AppText>
            <View style={[styles.timeBox, { borderColor: theme.brand.primary, backgroundColor: theme.brand.primary + '10' }]}>
              <AppText style={[styles.timeBoxText, { color: theme.brand.primary }]}>{selectedMinute.toString().padStart(2, '0')}</AppText>
            </View>
            <View style={[styles.amPmBox, { backgroundColor: theme.brand.primary + '10', borderColor: theme.brand.primary }]}>
              <AppText style={[styles.amPm, { color: theme.brand.primary }]}>{selectedHour >= 12 ? 'PM' : 'AM'}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  navButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  monthTitle: { fontSize: 18, fontWeight: '800' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  weekdayText: { width: '14.28%', textAlign: 'center', fontSize: 13, fontWeight: '700' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  selectedDayCell: { backgroundColor: '#E31837', alignSelf: 'center' },
  todayCell: { borderWidth: 2, borderColor: '#E31837', alignSelf: 'center' },
  dayText: { fontSize: 16, fontWeight: '600' },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 8 },
  quickPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  quickPillText: { fontSize: 13, fontWeight: '700' },
  divider: { height: 1, marginVertical: 24 },
  timeSection: { gap: 12, alignContent: 'center', justifyContent: 'center', alignItems: 'center' },
  timeLabel: { fontSize: 16, fontWeight: '800' },
  timeControlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeBox: { width: 54, height: 44, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  timeBoxText: { fontSize: 18, fontWeight: '700' },
  colon: { fontSize: 20, fontWeight: '700' },
  amPmBox: { paddingHorizontal: 12, height: 44, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', minWidth: 50 },
  amPm: { fontSize: 14, fontWeight: '700' },
  pickerSubTitle: { fontSize: 20, fontWeight: '700', marginVertical: 20, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1.5, padding: 3, marginBottom: 20, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 15, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  gridItem: { width: '31%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  gridText: { fontSize: 16, fontWeight: '600' },
  yearList: { paddingBottom: 20 },
  yearItem: { paddingVertical: 15, alignItems: 'center', borderBottomWidth: 1.5 },
  yearText: { fontSize: 18, fontWeight: '600' },
  backBtn: { marginTop: 20, paddingVertical: 14, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
