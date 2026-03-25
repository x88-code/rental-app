import "./global.css";

import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quickFilters = ["Bedsitter", "1 Bedroom", "2 Bedroom", "Parking"];

const featuredHomes = [
  {
    id: "sunset",
    title: "Sunset Residency",
    location: "Westlands, Nairobi",
    price: "KES 38,000",
    tag: "Popular",
    details: "1 bed • Wi-Fi • Security",
  },
  {
    id: "ivy",
    title: "Ivy Heights",
    location: "Kilimani, Nairobi",
    price: "KES 52,000",
    tag: "New",
    details: "2 bed • Parking • Balcony",
  },
  {
    id: "harbor",
    title: "Harbor Court",
    location: "South B, Nairobi",
    price: "KES 29,500",
    tag: "Budget",
    details: "Studio • Water included",
  },
];

const insights = [
  { label: "Available", value: "124 homes" },
  { label: "Saved this week", value: "18 listings" },
  { label: "Average rent", value: "KES 41k" },
];

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-[#f4efe7]">
      <View className="absolute left-[-40] top-10 h-40 w-40 rounded-full bg-[#f97316]/15" />
      <View className="absolute right-[-30] top-32 h-52 w-52 rounded-full bg-[#0f766e]/10" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-6 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium uppercase tracking-[2px] text-[#0f766e]">
                Rental App
              </Text>
              <Text className="mt-2 text-3xl font-black leading-9 text-[#111827]">
                Find a calm place to call home.
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#111827]">
              <Text className="text-lg font-bold text-white">RA</Text>
            </View>
          </View>

          <View className="mt-6 rounded-[28px] bg-[#111827] px-5 py-6 shadow-sm">
            <Text className="text-sm font-semibold uppercase tracking-[2px] text-[#fdba74]">
              This Month
            </Text>
            <Text className="mt-3 text-2xl font-black text-white">
              24 new verified listings
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-300">
              Explore apartments, studios, and shared units with clear pricing,
              landlord details, and booking availability.
            </Text>

            <View className="mt-5 rounded-3xl bg-white px-4 py-4">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                Search location
              </Text>
              <TextInput
                placeholder="Westlands, Kilimani, South B..."
                placeholderTextColor="#94a3b8"
                className="mt-2 text-base font-medium text-slate-900"
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {quickFilters.map((filter, index) => (
              <View
                key={filter}
                className={`mr-3 rounded-full px-4 py-3 ${
                  index === 0 ? "bg-[#0f766e]" : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    index === 0 ? "text-white" : "text-slate-700"
                  }`}
                >
                  {filter}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View className="mt-7 flex-row flex-wrap justify-between">
            {insights.map((item) => (
              <View
                key={item.label}
                className="mb-3 w-[31%] rounded-[24px] bg-white px-3 py-4"
              >
                <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
                  {item.label}
                </Text>
                <Text className="mt-2 text-lg font-black text-slate-900">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-xl font-black text-slate-900">
              Featured homes
            </Text>
            <Text className="text-sm font-semibold text-[#0f766e]">See all</Text>
          </View>

          {featuredHomes.map((home, index) => (
            <View
              key={home.id}
              className={`mt-4 rounded-[30px] px-5 py-5 ${
                index === 1 ? "bg-[#0f766e]" : "bg-white"
              }`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text
                    className={`text-2xl font-black ${
                      index === 1 ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {home.title}
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${
                      index === 1 ? "text-emerald-50/90" : "text-slate-500"
                    }`}
                  >
                    {home.location}
                  </Text>
                </View>

                <View
                  className={`rounded-full px-3 py-2 ${
                    index === 1 ? "bg-white/15" : "bg-[#fff7ed]"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-[1.5px] ${
                      index === 1 ? "text-white" : "text-[#ea580c]"
                    }`}
                  >
                    {home.tag}
                  </Text>
                </View>
              </View>

              <View
                className={`mt-5 h-36 rounded-[26px] ${
                  index === 1 ? "bg-white/12" : "bg-[#f8fafc]"
                }`}
              >
                <View className="flex-1 items-center justify-center">
                  <Text
                    className={`text-sm font-semibold uppercase tracking-[2px] ${
                      index === 1 ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    Property Preview
                  </Text>
                </View>
              </View>

              <View className="mt-5 flex-row items-end justify-between">
                <View>
                  <Text
                    className={`text-xs font-semibold uppercase tracking-[1.5px] ${
                      index === 1 ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    Monthly rent
                  </Text>
                  <Text
                    className={`mt-1 text-2xl font-black ${
                      index === 1 ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {home.price}
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${
                      index === 1 ? "text-white/80" : "text-slate-500"
                    }`}
                  >
                    {home.details}
                  </Text>
                </View>

                <View
                  className={`rounded-full px-4 py-3 ${
                    index === 1 ? "bg-white" : "bg-[#111827]"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      index === 1 ? "text-[#0f766e]" : "text-white"
                    }`}
                  >
                    View
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-5 right-5 rounded-[28px] bg-[#111827] px-5 py-4">
        <View className="flex-row items-center justify-between">
          <View className="items-center">
            <Text className="text-sm font-black text-white">Home</Text>
            <View className="mt-2 h-1.5 w-10 rounded-full bg-[#fb923c]" />
          </View>
          <Text className="text-sm font-semibold text-slate-400">Saved</Text>
          <Text className="text-sm font-semibold text-slate-400">Bookings</Text>
          <Text className="text-sm font-semibold text-slate-400">Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
