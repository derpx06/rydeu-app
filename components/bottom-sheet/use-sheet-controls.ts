import { ReactNode } from 'react';

import { BottomSheetOptions } from '@/components/bottom-sheet/bottom-sheet-provider';

type SheetFns = {
  openSheet: (content: ReactNode, options?: BottomSheetOptions) => string | null;
  closeSheet: (id?: string) => void;
  updateSheet?: (id: string, options: Partial<BottomSheetOptions>) => void;
  openSheetAsync?: <T>(
    contentFactory: (controls: {
      resolve: (value: T) => void;
      reject: (reason?: unknown) => void;
      close: () => void;
    }) => ReactNode,
    options?: BottomSheetOptions,
  ) => Promise<T>;
};

let sheetFns: SheetFns = {
  openSheet: () => {
    console.warn('Bottom sheet is not ready yet');
    return null;
  },
  closeSheet: () => {
    console.warn('Bottom sheet is not ready yet');
  },
};

export const SheetManager = {
  open: (content: ReactNode, options: BottomSheetOptions = {}) => sheetFns.openSheet(content, options),
  close: (id?: string) => sheetFns.closeSheet(id),
  update: (id: string, options: Partial<BottomSheetOptions>) => sheetFns.updateSheet?.(id, options),
  openAsync: <T>(
    contentFactory: (controls: {
      resolve: (value: T) => void;
      reject: (reason?: unknown) => void;
      close: () => void;
    }) => ReactNode,
    options: BottomSheetOptions = {},
  ) => sheetFns.openSheetAsync?.<T>(contentFactory, options),
};

export const __SET_SHEET_FNS = (fns: SheetFns) => {
  sheetFns = fns;
};
