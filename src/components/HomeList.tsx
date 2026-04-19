import { Pressable, Text, View } from "react-native";

import type { Home } from "../types/rental";

type HomeListProps = {
  filteredHomes: Home[];
  savedHomes: string[];
  selectedHomeId: string | null;
  onHomeAction: (home: Home) => void;
  onHomeFilter: (home: Home) => void;
  onHomeSaveToggle: (home: Home, isSaved: boolean) => void;
  onHomeSelect: (home: Home) => void;
};

export function HomeList({
  filteredHomes,
  savedHomes,
  selectedHomeId,
  onHomeAction,
  onHomeFilter,
  onHomeSaveToggle,
  onHomeSelect,
}: HomeListProps) {
  if (filteredHomes.length === 0) {
    return (
      <View className="mt-4 rounded-[30px] bg-white px-5 py-10">
        <Text className="text-xl font-black text-slate-900">
          No homes match that filter.
        </Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500">
          Try a different location, switch tabs, or clear the active filter to
          see more rentals.
        </Text>
      </View>
    );
  }

  return (
    <>
      {filteredHomes.map((home, index) => {
        const isSelected = selectedHomeId === home.id;
        const isSaved = savedHomes.includes(home.id);

        return (
          <Pressable
            key={home.id}
            onPress={() => onHomeSelect(home)}
            className={`mt-4 rounded-[30px] px-5 py-5 ${
              isSelected ? "bg-[#0f766e]" : "bg-white"
            }`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text
                  className={`text-2xl font-black ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {home.title}
                </Text>
                <Text
                  className={`mt-1 text-sm ${
                    isSelected ? "text-emerald-50/90" : "text-slate-500"
                  }`}
                >
                  {home.location}
                </Text>
              </View>

              <View className="items-end">
                <Pressable
                  onPress={() => onHomeFilter(home)}
                  className={`rounded-full px-3 py-2 ${
                    isSelected ? "bg-white/15" : "bg-[#fff7ed]"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-[1.5px] ${
                      isSelected ? "text-white" : "text-[#ea580c]"
                    }`}
                  >
                    {home.tag}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onHomeSaveToggle(home, isSaved)}
                  className={`mt-3 rounded-full px-3 py-2 ${
                    isSelected ? "bg-white/15" : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              className={`mt-5 h-36 rounded-[26px] ${
                isSelected ? "bg-white/12" : "bg-[#f8fafc]"
              }`}
            >
              <View className="flex-1 items-center justify-center">
                <Text
                  className={`text-sm font-semibold uppercase tracking-[2px] ${
                    isSelected ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {index === 0 ? "Tap card to preview details" : "Ready to view"}
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row items-end justify-between">
              <View>
                <Text
                  className={`text-xs font-semibold uppercase tracking-[1.5px] ${
                    isSelected ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  Monthly rent
                </Text>
                <Text
                  className={`mt-1 text-2xl font-black ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {home.priceLabel}
                </Text>
                <Text
                  className={`mt-1 text-sm ${
                    isSelected ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {home.details}
                </Text>
              </View>

              <Pressable
                onPress={() => onHomeAction(home)}
                className={`rounded-full px-4 py-3 ${
                  isSelected ? "bg-white" : "bg-[#111827]"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    isSelected ? "text-[#0f766e]" : "text-white"
                  }`}
                >
                  {isSelected ? "Selected" : "View"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        );
      })}
    </>
  );
}
