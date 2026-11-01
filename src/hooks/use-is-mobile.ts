import { useWindowDimensions } from 'react-native';

export const MOBILE_BREAKPOINT = 760;

/** True on phones and narrow browser windows. */
export function useIsMobile(): boolean {
  const { width } = useWindowDimensions();
  return width < MOBILE_BREAKPOINT;
}
