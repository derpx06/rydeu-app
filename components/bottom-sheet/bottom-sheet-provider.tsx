import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomSheetEnvironmentProvider,
} from '@/components/bottom-sheet/bottom-sheet-environment';
import { __SET_SHEET_FNS } from '@/components/bottom-sheet/use-sheet-controls';
import { IconButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { 
  BottomSheetContext, 
  BottomSheetContextValue, 
  BottomSheetOptions, 
  SheetIdContext, 
  useBottomSheet, 
  useSheetId 
} from './bottom-sheet-context';

export { BottomSheetOptions, useBottomSheet, useSheetId };

type Sheet = BottomSheetOptions & {
  id: string;
  content: ReactNode;
};

const createSheetId = () => Math.random().toString(36).slice(2, 11);

function SheetRenderer({
  sheet,
  closeSheet,
  modalRefs,
  contextValue,
}: {
  sheet: Sheet;
  closeSheet: (id?: string) => void;
  modalRefs: React.MutableRefObject<Record<string, BottomSheetModal | null>>;
  contextValue: BottomSheetContextValue;
}) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const contentBottomPadding = insets.bottom + 28 + (sheet.contentBottomInset ?? 0);

  useEffect(() => {
    let frame = 0;
    const present = () => {
      if (modalRefs.current[sheet.id]) {
        modalRefs.current[sheet.id]?.present();
      } else if (frame < 50) {
        frame += 1;
        requestAnimationFrame(present);
      }
    };
    present();
  }, [modalRefs, sheet.id]);

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={sheet.backdropProps?.opacity ?? 1}
        pressBehavior={sheet.backdropProps?.pressBehavior ?? 'close'}
        style={[
          props.style,
          { backgroundColor: sheet.backdropProps?.color ?? theme.bottomSheet.backdrop },
        ]}
      />
    ),
    [sheet.backdropProps, theme.bottomSheet.backdrop],
  );

  const renderHandle = useCallback(
    () => (
      <View
        style={[
          styles.handleContainer,
          {
            backgroundColor: theme.bg.app,
            borderColor: theme.border.default,
          },
        ]}>
        <View style={[styles.handlePill, { backgroundColor: theme.bottomSheet.handle }]} />
        <View style={styles.handleRow}>
          {sheet.showCloseBtn === false ? (
            <View style={styles.handleSpacer} />
          ) : (
            <IconButton
              accessibilityLabel="Close bottom sheet"
              name="close"
              onPress={() => closeSheet(sheet.id)}
            />
          )}
          <AppText numberOfLines={1} variant="label" style={styles.handleTitle}>
            {sheet.title ?? ''}
          </AppText>
          {sheet.onSubmitPress ? (
            <IconButton
              accessibilityLabel={sheet.submitLabel ?? 'Submit bottom sheet'}
              name="checkmark"
              onPress={sheet.onSubmitPress}
            />
          ) : (
            <View style={styles.handleSpacer} />
          )}
        </View>
      </View>
    ),
    [closeSheet, sheet, theme.bg.elevated, theme.border.default, theme.bottomSheet.handle],
  );

  return (
    <BottomSheetModal
      ref={(ref) => {
        modalRefs.current[sheet.id] = ref;
      }}
      index={0}
      snapPoints={sheet.snapPoints ?? ['70%']}
      topInset={insets.top + 12}
      bottomInset={sheet.bottomInset ?? 0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.bg.app }}
      handleComponent={renderHandle}
      enablePanDownToClose={sheet.enablePanDownToClose ?? true}
      keyboardBehavior={sheet.keyboardAvoid === false ? undefined : 'extend'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onChange={(index) => {
        if (index === -1) closeSheet(sheet.id);
        sheet.onChange?.(index);
      }}
      onDismiss={() => closeSheet(sheet.id)}>
      <BottomSheetEnvironmentProvider isBottomSheet>
        <BottomSheetContext.Provider value={contextValue}>
          <SheetIdContext.Provider value={sheet.id}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoidingView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
              {sheet.enableScroll === false ? (
                <View style={[styles.content, { paddingBottom: contentBottomPadding }]}>
                  {sheet.content}
                </View>
              ) : (
                <BottomSheetScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[styles.content, { paddingBottom: contentBottomPadding }]}>
                  {sheet.content}
                </BottomSheetScrollView>
              )}
            </KeyboardAvoidingView>
          </SheetIdContext.Provider>
        </BottomSheetContext.Provider>
      </BottomSheetEnvironmentProvider>
    </BottomSheetModal>
  );
}

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const modalRefs = useRef<Record<string, BottomSheetModal | null>>({});
  const lastOpenedAt = useRef(0);

  const closeSheet = useCallback((id?: string) => {
    setSheets((current) => {
      if (!id) return current.slice(0, -1);
      return current.filter((sheet) => sheet.id !== id);
    });
  }, []);

  const openSheet = useCallback((content: ReactNode, options: BottomSheetOptions = {}) => {
    const now = Date.now();
    // if (now - lastOpenedAt.current < 250) return null;
    lastOpenedAt.current = now;

    const sheet: Sheet = {
      id: createSheetId(),
      content,
      ...options,
    };
    setSheets((current) => [...current, sheet]);
    return sheet.id;
  }, []);

  const updateSheet = useCallback((id: string, options: Partial<BottomSheetOptions>) => {
    setSheets((current) => current.map((sheet) => (sheet.id === id ? { ...sheet, ...options } : sheet)));
  }, []);

  const openSheetAsync = useCallback(
    async <T,>(
      contentFactory: (controls: {
        resolve: (value: T) => void;
        reject: (reason?: unknown) => void;
        close: () => void;
      }) => ReactNode,
      options: BottomSheetOptions = {},
    ) =>
      new Promise<T>((resolve, reject) => {
        let id: string | null = null;
        const close = () => {
          if (id) closeSheet(id);
        };
        id = openSheet(contentFactory({ resolve, reject, close }), options);
      }),
    [closeSheet, openSheet],
  );

  const value = useMemo(
    () => ({ openSheet, closeSheet, updateSheet }),
    [closeSheet, openSheet, updateSheet],
  );

  useEffect(() => {
    __SET_SHEET_FNS({ openSheet, closeSheet, updateSheet, openSheetAsync });
  }, [closeSheet, openSheet, openSheetAsync, updateSheet]);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sheets.length === 0) return false;
      closeSheet(sheets[sheets.length - 1]?.id);
      return true;
    });

    return () => subscription.remove();
  }, [closeSheet, sheets]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetContext.Provider value={value}>
        {children}
        {sheets.map((sheet) => (
          <SheetRenderer
            key={sheet.id}
            closeSheet={closeSheet}
            modalRefs={modalRefs}
            sheet={sheet}
            contextValue={value}
          />
        ))}
      </BottomSheetContext.Provider>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
  },
  handlePill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  handleRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  handleTitle: {
    flex: 1,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  handleSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
