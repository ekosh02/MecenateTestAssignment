import { COLORS } from "@/constants/colors";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export const bottomTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: COLORS.PRIMARY,
  tabBarInactiveTintColor: "#8C95A8",
  tabBarStyle: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E8EBF0",
    borderTopWidth: 1,
  },
};
