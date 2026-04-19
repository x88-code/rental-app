import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { insights, quickFilters } from "../data/rentalData";
import type {
  ActiveTab,
  BookingItem,
  Home,
  InsightItem,
  ProfileForm,
} from "../types/rental";
import { BookingList } from "./BookingList";
import { BottomNav } from "./BottomNav";
import { HomeList } from "./HomeList";
import { InsightGrid } from "./InsightGrid";
import { ProfileCard } from "./ProfileCard";
import { SearchPanel } from "./SearchPanel";

type DashboardScreenProps = {
  actionMessage: string;
  activeFilter: string;
  activeTab: ActiveTab;
  bookings: BookingItem[];
  displayName: string;
  displayedInsight: InsightItem;
  filteredHomes: Home[];
  isEditingProfile: boolean;
  locationSuggestions: string[];
  profile: ProfileForm;
  savedHomes: string[];
  searchTerm: string;
  selectedBookingId: string | null;
  selectedHomeId: string | null;
  userInitials: string;
  onAvatarPress: () => void;
  onBookingCancel: (booking: BookingItem) => void;
  onBookingConfirm: (booking: BookingItem) => void;
  onBookingFocus: (booking: BookingItem) => void;
  onBookingOpen: (booking: BookingItem) => void;
  onBookingReschedule: (booking: BookingItem) => void;
  onFilterChange: (filter: string) => void;
  onHomeAction: (home: Home) => void;
  onHomeFilter: (home: Home) => void;
  onHomeSaveToggle: (home: Home, isSaved: boolean) => void;
  onHomeSelect: (home: Home) => void;
  onInsightPress: (label: string) => void;
  onLocationPick: (location: string) => void;
  onLogout: () => void;
  onProfileEdit: () => void;
  onProfileFieldChange: (field: keyof ProfileForm, value: string) => void;
  onProfileReset: () => void;
  onResetView: () => void;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: ActiveTab) => void;
};

export function DashboardScreen({
  actionMessage,
  activeFilter,
  activeTab,
  bookings,
  displayName,
  displayedInsight,
  filteredHomes,
  isEditingProfile,
  locationSuggestions,
  profile,
  savedHomes,
  searchTerm,
  selectedBookingId,
  selectedHomeId,
  userInitials,
  onAvatarPress,
  onBookingCancel,
  onBookingConfirm,
  onBookingFocus,
  onBookingOpen,
  onBookingReschedule,
  onFilterChange,
  onHomeAction,
  onHomeFilter,
  onHomeSaveToggle,
  onHomeSelect,
  onInsightPress,
  onLocationPick,
  onLogout,
  onProfileEdit,
  onProfileFieldChange,
  onProfileReset,
  onResetView,
  onSearchChange,
  onTabChange,
}: DashboardScreenProps) {
  const pageTitle =
    activeTab === "Saved"
      ? "Your saved homes in one place."
      : activeTab === "Bookings"
        ? "Track bookings and next steps."
        : activeTab === "Profile"
          ? "Manage your renter profile."
          : "Find a calm place to call home.";
  const heroTitle =
    activeTab === "Saved"
      ? `${savedHomes.length} homes saved for later`
      : activeTab === "Bookings"
        ? "Stay on top of every visit"
        : activeTab === "Profile"
          ? `Welcome back, ${profile.firstName}`
          : "24 new verified listings";
  const sectionTitle =
    activeTab === "Bookings"
      ? "Upcoming bookings"
      : activeTab === "Saved"
        ? "Saved homes"
        : "Featured homes";
  const sectionCount =
    activeTab === "Bookings"
      ? `${bookings.length} visits`
      : `${filteredHomes.length} results`;
  const showFilters = activeTab !== "Bookings" && activeTab !== "Profile";
  const showListingsSection = activeTab !== "Profile";

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
                {pageTitle}
              </Text>
            </View>

            <Pressable
              onPress={onAvatarPress}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-[#111827]"
            >
              <Text className="text-lg font-bold text-white">{userInitials}</Text>
            </Pressable>
          </View>

          <View className="mt-6 rounded-[28px] bg-[#111827] px-5 py-6 shadow-sm">
            <Text className="text-sm font-semibold uppercase tracking-[2px] text-[#fdba74]">
              {activeTab === "Bookings" ? "Bookings" : "This Month"}
            </Text>
            <Text className="mt-3 text-2xl font-black text-white">{heroTitle}</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-300">
              Search, shortlist, and manage rental options with cleaner pricing,
              faster booking follow-up, and simple landlord discovery.
            </Text>
            <Pressable
              onPress={onResetView}
              className="mt-4 self-start rounded-full bg-white/10 px-4 py-3"
            >
              <Text className="text-xs font-bold uppercase tracking-[1.5px] text-white">
                Reset view
              </Text>
            </Pressable>

            {activeTab === "Profile" ? (
              <ProfileCard
                displayName={displayName}
                isEditingProfile={isEditingProfile}
                profile={profile}
                onLogout={onLogout}
                onProfileEdit={onProfileEdit}
                onProfileFieldChange={onProfileFieldChange}
                onProfileReset={onProfileReset}
              />
            ) : activeTab === "Bookings" ? (
              <View className="mt-5 rounded-3xl bg-white px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                  Booking overview
                </Text>
                <Text className="mt-2 text-lg font-black text-slate-900">
                  {bookings.length} visits planned this week
                </Text>
                <Text className="mt-2 text-sm leading-6 text-slate-500">
                  Track confirmed tours, pending approvals, and any schedule
                  changes from one place.
                </Text>
              </View>
            ) : (
              <SearchPanel
                locationSuggestions={locationSuggestions}
                searchTerm={searchTerm}
                onLocationPick={onLocationPick}
                onSearchChange={onSearchChange}
              />
            )}
          </View>

          {showFilters ? (
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
                    onPress={() => onFilterChange(filter)}
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
          ) : null}

          <InsightGrid
            items={[displayedInsight, insights[1], insights[2]]}
            onInsightPress={onInsightPress}
          />

          <View className="rounded-[24px] bg-[#fff7ed] px-4 py-4">
            <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-[#c2410c]">
              Live action
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-700">
              {actionMessage}
            </Text>
          </View>

          {showListingsSection ? (
            <>
              <View className="mt-5 flex-row items-center justify-between">
                <Text className="text-xl font-black text-slate-900">{sectionTitle}</Text>
                <Text className="text-sm font-semibold text-[#0f766e]">
                  {sectionCount}
                </Text>
              </View>

              {activeTab === "Bookings" ? (
                <BookingList
                  bookings={bookings}
                  selectedBookingId={selectedBookingId}
                  onBookingCancel={onBookingCancel}
                  onBookingConfirm={onBookingConfirm}
                  onBookingFocus={onBookingFocus}
                  onBookingOpen={onBookingOpen}
                  onBookingReschedule={onBookingReschedule}
                />
              ) : (
                <HomeList
                  filteredHomes={filteredHomes}
                  savedHomes={savedHomes}
                  selectedHomeId={selectedHomeId}
                  onHomeAction={onHomeAction}
                  onHomeFilter={onHomeFilter}
                  onHomeSaveToggle={onHomeSaveToggle}
                  onHomeSelect={onHomeSelect}
                />
              )}
            </>
          ) : null}
        </View>
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </SafeAreaView>
  );
}
