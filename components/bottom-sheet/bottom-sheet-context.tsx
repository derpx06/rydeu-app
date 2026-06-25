import { ReactNode, createContext, useContext } from 'react';

export type BottomSheetOptions = {
  title?: string;
  snapPoints?: string[];
  showCloseBtn?: boolean;
  onSubmitPress?: (() => void) | null;
  submitLabel?: string;
  enablePanDownToClose?: boolean;
  enableScroll?: boolean;
  keyboardAvoid?: boolean;
  bottomInset?: number;
  contentBottomInset?: number;
  onChange?: (index: number) => void;
  backdropProps?: {
    pressBehavior?: 'close' | 'collapse' | 'none';
    opacity?: number;
    color?: string;
  };
};

export type BottomSheetContextValue = {
  openSheet: (content: ReactNode, options?: BottomSheetOptions) => string | null;
  closeSheet: (id?: string) => void;
  updateSheet: (id: string, options: Partial<BottomSheetOptions>) => void;
};

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet() {
  const value = useContext(BottomSheetContext);
  if (!value) throw new Error('useBottomSheet must be used within BottomSheetProvider');
  return value;
}

export const SheetIdContext = createContext<string | null>(null);

export function useSheetId() {
  return useContext(SheetIdContext);
}
