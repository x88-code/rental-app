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
        const cardClassName = isSelected
          ? "mt-4 rounded-[30px] bg-[#0f766e] px-5 py-5"
          : "mt-4 rounded-[30px] bg-white px-5 py-5";
        const titleClassName = isSelected
          ? "text-2xl font-black text-white"
          : "text-2xl font-black text-slate-900";
        const locationClassName = isSelected
          ? "mt-1 text-sm text-emerald-50/90"
          : "mt-1 text-sm text-slate-500";
        const tagButtonClassName = isSelected
          ? "rounded-full bg-white/15 px-3 py-2"
          : "rounded-full bg-[#fff7ed] px-3 py-2";
        const tagTextClassName = isSelected
          ? "text-xs font-bold uppercase tracking-[1.5px] text-white"
          : "text-xs font-bold uppercase tracking-[1.5px] text-[#ea580c]";
        const saveButtonClassName = isSelected
          ? "mt-3 rounded-full bg-white/15 px-3 py-2"
          : "mt-3 rounded-full bg-slate-100 px-3 py-2";
        const saveTextClassName = isSelected
          ? "text-xs font-bold text-white"
          : "text-xs font-bold text-slate-700";
        const previewCardClassName = isSelected
          ? "mt-5 h-36 rounded-[26px] bg-white/12"
          : "mt-5 h-36 rounded-[26px] bg-[#f8fafc]";
        const previewTextClassName = isSelected
          ? "text-sm font-semibold uppercase tracking-[2px] text-white/70"
          : "text-sm font-semibold uppercase tracking-[2px] text-slate-400";
        const rentLabelClassName = isSelected
          ? "text-xs font-semibold uppercase tracking-[1.5px] text-white/70"
          : "text-xs font-semibold uppercase tracking-[1.5px] text-slate-400";
        const rentValueClassName = isSelected
          ? "mt-1 text-2xl font-black text-white"
          : "mt-1 text-2xl font-black text-slate-900";
        const detailsClassName = isSelected
          ? "mt-1 text-sm text-white/80"
          : "mt-1 text-sm text-slate-500";
        const actionButtonClassName = isSelected
          ? "rounded-full bg-white px-4 py-3"
          : "rounded-full bg-[#111827] px-4 py-3";
        const actionTextClassName = isSelected
          ? "text-sm font-bold text-[#0f766e]"
          : "text-sm font-bold text-white";

        return (
          <Pressable
            key={home.id}
            onPress={() => onHomeSelect(home)}
            className={cardClassName}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className={titleClassName}>{home.title}</Text>
                <Text className={locationClassName}>{home.location}</Text>
              </View>

              <View className="items-end">
                <Pressable
                  onPress={() => onHomeFilter(home)}
                  className={tagButtonClassName}
                >
                  <Text className={tagTextClassName}>{home.tag}</Text>
                </Pressable>

                <Pressable
                  onPress={() => onHomeSaveToggle(home, isSaved)}
                  className={saveButtonClassName}
                >
                  <Text className={saveTextClassName}>{isSaved ? "Saved" : "Save"}</Text>
                </Pressable>
              </View>
            </View>

            <View className={previewCardClassName}>
              <View className="flex-1 items-center justify-center">
                <Text className={previewTextClassName}>
                  {index === 0 ? "Tap card to preview details" : "Ready to view"}
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row items-end justify-between">
              <View>
                <Text className={rentLabelClassName}>Monthly rent</Text>
                <Text className={rentValueClassName}>{home.priceLabel}</Text>
                <Text className={detailsClassName}>{home.details}</Text>
              </View>

              <Pressable
                onPress={() => onHomeAction(home)}
                className={actionButtonClassName}
              >
                <Text className={actionTextClassName}>
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
