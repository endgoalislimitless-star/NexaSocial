import { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";

import { Spacing } from "@/constants/theme";

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useContext(BottomTabBarHeightContext);

  return {
    paddingTop: headerHeight + Spacing.xl,
    paddingBottom: tabBarHeight ? tabBarHeight + Spacing.xl : insets.bottom + Spacing.xl,
    scrollInsetBottom: insets.bottom + 16,
  };
}
