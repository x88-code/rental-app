import { Pressable, Text, View } from "react-native";

import type { InsightItem } from "../types/rental";

type InsightGridProps = {
  items: InsightItem[];
  onInsightPress: (label: string) => void;
};

export function InsightGrid({ items, onInsightPress }: InsightGridProps) {
  return (
    <View className="mt-7 flex-row flex-wrap justify-between">
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => onInsightPress(item.label)}
          className="mb-3 w-[31%] rounded-[24px] bg-white px-3 py-4"
        >
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
            {item.label}
          </Text>
          <Text className="mt-2 text-lg font-black text-slate-900">
            {item.value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
