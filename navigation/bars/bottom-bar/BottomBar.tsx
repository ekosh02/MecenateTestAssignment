import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { bottomTabScreenOptions } from "./tabBarScreenOptions";

const BottomBar = () => (
  <Tabs screenOptions={bottomTabScreenOptions}>
    <Tabs.Screen
      name="index"
      options={{
        title: "Posts",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="newspaper-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tabs>
);

export default BottomBar;
