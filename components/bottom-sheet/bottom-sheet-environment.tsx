import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

const BottomSheetEnvironmentContext = createContext({ isBottomSheet: false });

export function BottomSheetEnvironmentProvider({
  children,
  isBottomSheet,
}: PropsWithChildren<{ isBottomSheet: boolean }>) {
  const value = useMemo(() => ({ isBottomSheet }), [isBottomSheet]);

  return (
    <BottomSheetEnvironmentContext.Provider value={value}>
      {children}
    </BottomSheetEnvironmentContext.Provider>
  );
}

export function useBottomSheetEnvironment() {
  return useContext(BottomSheetEnvironmentContext);
}
