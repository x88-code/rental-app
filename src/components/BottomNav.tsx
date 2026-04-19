import { Pressable, Text, View } from "react-native";

import { navItems } from "../data/rentalData";
import type { ActiveTab } from "../types/rental";

type BottomNavProps = {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <View className="absolute bottom-6 left-5 right-5 rounded-[28px] bg-[#111827] px-5 py-4">
      <View className="flex-row items-center justify-between">
        {navItems.map((item) => {
          const isActive = activeTab === item;

          return (
            <Pressable
              key={item}
              onPress={() => onTabChange(item)}
              className="items-center"
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              >
                {item}
              </Text>
              <View
                className={`mt-2 h-1.5 w-10 rounded-full ${
                  isActive ? "bg-[#fb923c]" : "bg-transparent"
                }`}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
