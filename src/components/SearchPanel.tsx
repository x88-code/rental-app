import { Pressable, Text, TextInput, View } from "react-native";

type SearchPanelProps = {
  locationSuggestions: string[];
  searchTerm: string;
  onLocationPick: (location: string) => void;
  onSearchChange: (value: string) => void;
};

export function SearchPanel({
  locationSuggestions,
  searchTerm,
  onLocationPick,
  onSearchChange,
}: SearchPanelProps) {
  return (
    <View className="mt-5 rounded-3xl bg-white px-4 py-4">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
        Search location
      </Text>
      <TextInput
        className="mt-2 text-base font-medium text-slate-900"
        placeholder="Westlands, Kilimani, South B..."
        placeholderTextColor="#94a3b8"
        value={searchTerm}
        onChangeText={onSearchChange}
      />
      <Text className="mt-3 text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
        Quick picks
      </Text>
      <View className="mt-3 flex-row flex-wrap">
        {locationSuggestions.map((location) => (
          <Pressable
            key={location}
            onPress={() => onLocationPick(location)}
            className="mb-2 mr-2 rounded-full bg-[#fff7ed] px-4 py-3"
          >
            <Text className="text-sm font-semibold text-[#c2410c]">{location}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
