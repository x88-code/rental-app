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
          const labelClassName = isActive
            ? "text-sm font-semibold text-white"
            : "text-sm font-semibold text-slate-400";
          const indicatorClassName = isActive
            ? "mt-2 h-1.5 w-10 rounded-full bg-[#fb923c]"
            : "mt-2 h-1.5 w-10 rounded-full bg-transparent";

          return (
            <Pressable
              key={item}
              onPress={() => onTabChange(item)}
              className="items-center"
            >
              <Text className={labelClassName}>{item}</Text>
              <View className={indicatorClassName} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
