import "./global.css";

import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = "http://192.168.100.3/api/v1";

const quickFilters = ["All", "Bedsitter", "1 Bedroom", "2 Bedroom", "Parking"];

const featuredHomes = [
  {
    id: "sunset",
    title: "Sunset Residency",
    location: "Westlands, Nairobi",
    area: "Westlands",
    priceLabel: "KES 38,000",
    tag: "Popular",
    details: "1 bed • Wi-Fi • Security",
    bedrooms: "1 Bedroom",
    hasParking: false,
  },
  {
    id: "ivy",
    title: "Ivy Heights",
    location: "Kilimani, Nairobi",
    area: "Kilimani",
    priceLabel: "KES 52,000",
    tag: "New",
    details: "2 bed • Parking • Balcony",
    bedrooms: "2 Bedroom",
    hasParking: true,
  },
  {
    id: "harbor",
    title: "Harbor Court",
    location: "South B, Nairobi",
    area: "South B",
    priceLabel: "KES 29,500",
    tag: "Budget",
    details: "Studio • Water included",
    bedrooms: "Bedsitter",
    hasParking: false,
  },
];

const insights = [
  { label: "Available", value: "124 homes" },
  { label: "Saved this week", value: "18 listings" },
  { label: "Average rent", value: "KES 41k" },
];

const navItems = ["Home", "Saved", "Bookings", "Profile"];

type SessionUser = {
  firstName?: string;
  lastName?: string;
  email: string;
};

type AuthResponse = {
  message?: string;
  token?: string;
  data?: {
    token?: string;
    user?: SessionUser;
  };
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHomeId, setSelectedHomeId] = useState(featuredHomes[0].id);
  const [savedHomes, setSavedHomes] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const filteredHomes = useMemo(() => {
    return featuredHomes.filter((home) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        home.title.toLowerCase().includes(normalizedSearch) ||
        home.location.toLowerCase().includes(normalizedSearch) ||
        home.area.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        activeFilter === "All" ||
        home.bedrooms === activeFilter ||
        (activeFilter === "Parking" && home.hasParking);

      if (activeTab === "Saved" && !savedHomes.includes(home.id)) {
        return false;
      }

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, activeTab, savedHomes, searchTerm]);

  useEffect(() => {
    if (!filteredHomes.length) {
      return;
    }

    const stillVisible = filteredHomes.some((home) => home.id === selectedHomeId);

    if (!stillVisible) {
      setSelectedHomeId(filteredHomes[0].id);
    }
  }, [filteredHomes, selectedHomeId]);

  const selectedHome =
    filteredHomes.find((home) => home.id === selectedHomeId) ?? filteredHomes[0];

  const displayedInsight = (() => {
    if (activeTab === "Saved") {
      return { label: "Saved homes", value: `${savedHomes.length} active` };
    }

    if (activeTab === "Bookings") {
      return { label: "Pending tours", value: "3 requests" };
    }

    if (activeTab === "Profile") {
      return { label: "Profile", value: "92% complete" };
    }

    return insights[0];
  })();

  const userInitials = `${sessionUser?.firstName?.[0] ?? "R"}${sessionUser?.lastName?.[0] ?? "A"}`;
  const displayName =
    [sessionUser?.firstName, sessionUser?.lastName].filter(Boolean).join(" ") ||
    sessionUser?.email ||
    "Renter";

  const toggleSaved = (homeId: string) => {
    setSavedHomes((current) =>
      current.includes(homeId)
        ? current.filter((id) => id !== homeId)
        : [...current, homeId]
    );
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setAuthError("Enter both email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const payload = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setAuthError(payload.message || "Login failed. Please try again.");
        return;
      }

      setSessionUser(
        payload.data?.user ?? {
          email: normalizedEmail,
        }
      );
      setPassword("");
      setActiveTab("Home");
    } catch {
      setAuthError(
        "We couldn't reach the backend. Update API_BASE_URL in App.tsx if your server is running on another host."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setSessionUser(null);
    setPassword("");
    setAuthError("");
    setActiveTab("Home");
  };

  if (!sessionUser) {
    return (
      <SafeAreaView className="flex-1 bg-[#f7efe3]">
        <View className="absolute left-[-50] top-8 h-44 w-44 rounded-full bg-[#ea580c]/15" />
        <View className="absolute right-[-60] top-28 h-72 w-72 rounded-full bg-[#0f766e]/10" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-8 pt-5">
            <View className="rounded-[34px] bg-[#111827] px-6 py-7">
              <Text className="text-sm font-semibold uppercase tracking-[2px] text-[#fdba74]">
                Rental App
              </Text>
              <Text className="mt-4 text-4xl font-black leading-[44px] text-white">
                Sign in and pick your next place with less friction.
              </Text>
              <Text className="mt-4 text-sm leading-6 text-slate-300">
                Track saved rentals, bookings, and tenant updates from one calm
                dashboard.
              </Text>

              <View className="mt-6 flex-row flex-wrap justify-between">
                {[
                  "Verified listings",
                  "Tour booking flow",
                  "Tenant profile tracking",
                ].map((item) => (
                  <View
                    key={item}
                    className="mb-3 rounded-full bg-white/10 px-4 py-3"
                  >
                    <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-white">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-6 rounded-[34px] bg-white px-5 py-6">
              <Text className="text-2xl font-black text-slate-900">Login</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Use the account registered on your backend at
                {" "}
                {API_BASE_URL}
                .
              </Text>

              <View className="mt-6 rounded-[26px] bg-[#f8fafc] px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                  Email address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (authError) {
                      setAuthError("");
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor="#94a3b8"
                  className="mt-2 text-base font-medium text-slate-900"
                />
              </View>

              <View className="mt-4 rounded-[26px] bg-[#f8fafc] px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    if (authError) {
                      setAuthError("");
                    }
                  }}
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  className="mt-2 text-base font-medium text-slate-900"
                />
              </View>

              {authError ? (
                <View className="mt-4 rounded-2xl bg-[#fff1f2] px-4 py-4">
                  <Text className="text-sm font-medium leading-6 text-[#be123c]">
                    {authError}
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleLogin}
                disabled={isSubmitting}
                className={`mt-6 rounded-[26px] px-5 py-5 ${
                  isSubmitting ? "bg-[#0f766e]/70" : "bg-[#0f766e]"
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-base font-black uppercase tracking-[2px] text-white">
                      Sign in
                    </Text>
                  )}
                </View>
              </Pressable>

              <Text className="mt-4 text-center text-sm leading-6 text-slate-500">
                If you're testing on a physical phone, replace
                {" "}
                `localhost`
                {" "}
                with your computer's LAN IP inside
                {" "}
                `API_BASE_URL`
                .
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium uppercase tracking-[2px] text-[#0f766e]">
                Rental App
              </Text>
              <Text className="mt-2 text-3xl font-black leading-9 text-[#111827]">
                {activeTab === "Saved"
                  ? "Your saved homes in one place."
                  : activeTab === "Bookings"
                    ? "Track bookings and next steps."
                    : activeTab === "Profile"
                      ? "Manage your renter profile."
                      : "Find a calm place to call home."}
              </Text>
            </View>

            <Pressable
              onPress={() => setActiveTab("Profile")}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-[#111827]"
            >
              <Text className="text-lg font-bold text-white">{userInitials}</Text>
            </Pressable>
          </View>

          <View className="mt-6 rounded-[28px] bg-[#111827] px-5 py-6 shadow-sm">
            <Text className="text-sm font-semibold uppercase tracking-[2px] text-[#fdba74]">
              {activeTab === "Bookings" ? "Bookings" : "This Month"}
            </Text>
            <Text className="mt-3 text-2xl font-black text-white">
              {activeTab === "Saved"
                ? `${savedHomes.length} homes saved for later`
                : activeTab === "Bookings"
                  ? "2 approvals waiting for action"
                  : activeTab === "Profile"
                    ? `Welcome back, ${sessionUser.firstName || "renter"}`
                    : "24 new verified listings"}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-300">
              Search, shortlist, and manage rental options with cleaner pricing,
              faster booking follow-up, and simple landlord discovery.
            </Text>

            {activeTab === "Profile" ? (
              <View className="mt-5 rounded-3xl bg-white px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                  Logged in as
                </Text>
                <Text className="mt-2 text-lg font-black text-slate-900">
                  {displayName}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  {sessionUser.email}
                </Text>

                <Pressable
                  onPress={handleLogout}
                  className="mt-4 self-start rounded-full bg-[#111827] px-4 py-3"
                >
                  <Text className="text-sm font-bold text-white">Log out</Text>
                </Pressable>
              </View>
            ) : (
              <View className="mt-5 rounded-3xl bg-white px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                  Search location
                </Text>
                <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholder="Westlands, Kilimani, South B..."
                  placeholderTextColor="#94a3b8"
                  className="mt-2 text-base font-medium text-slate-900"
                />
              </View>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {quickFilters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`mr-3 rounded-full px-4 py-3 ${
                    isActive ? "bg-[#0f766e]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-7 flex-row flex-wrap justify-between">
            {[displayedInsight, insights[1], insights[2]].map((item) => (
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
              {activeTab === "Saved" ? "Saved homes" : "Featured homes"}
            </Text>
            <Text className="text-sm font-semibold text-[#0f766e]">
              {filteredHomes.length} results
            </Text>
          </View>

          {filteredHomes.length === 0 ? (
            <View className="mt-4 rounded-[30px] bg-white px-5 py-10">
              <Text className="text-xl font-black text-slate-900">
                No homes match that filter.
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Try a different location, switch tabs, or clear the active
                filter to see more rentals.
              </Text>
            </View>
          ) : (
            filteredHomes.map((home, index) => {
              const isSelected = selectedHome?.id === home.id;
              const isSaved = savedHomes.includes(home.id);

              return (
                <Pressable
                  key={home.id}
                  onPress={() => setSelectedHomeId(home.id)}
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
                      <View
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
                      </View>

                      <Pressable
                        onPress={() => toggleSaved(home.id)}
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

                    <View
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
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-5 right-5 rounded-[28px] bg-[#111827] px-5 py-4">
        <View className="flex-row items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item;

            return (
              <Pressable
                key={item}
                onPress={() => setActiveTab(item)}
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
    </SafeAreaView>
  );
}
