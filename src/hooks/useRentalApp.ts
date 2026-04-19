import type { BookingItem, Home } from "../types/rental";
import { useRentalAuth } from "./useRentalAuth";
import { useRentalDashboard } from "./useRentalDashboard";

export function useRentalApp() {
  const dashboard = useRentalDashboard();
  const auth = useRentalAuth({
    setActionMessage: dashboard.setActionMessage,
    setActiveTab: dashboard.setActiveTab,
  });

  return {
    authenticatedUser: auth.authenticatedUser,
    authScreenProps: auth.authScreenProps,
    dashboardProps: {
      actionMessage: dashboard.actionMessage,
      activeFilter: dashboard.activeFilter,
      activeTab: dashboard.activeTab,
      bookings: dashboard.bookings,
      displayedInsight: dashboard.displayedInsight,
      filteredHomes: dashboard.filteredHomes,
      locationSuggestions: dashboard.locationSuggestions,
      savedHomes: dashboard.savedHomes,
      searchTerm: dashboard.searchTerm,
      selectedBookingId: dashboard.selectedBookingId,
      selectedHomeId: dashboard.selectedHomeId,
      onAvatarPress: () => dashboard.setActiveTab("Profile"),
      onBookingCancel: (booking: BookingItem) => {
        dashboard.setBookings((current) =>
          current.filter((item) => item.id !== booking.id)
        );
        dashboard.setSelectedBookingId((current) =>
          current === booking.id ? null : current
        );
        dashboard.setActionMessage("Booking removed from your schedule.");
      },
      onBookingConfirm: (booking: BookingItem) => {
        dashboard.updateBooking(booking.id, (current) => ({
          ...current,
          status: "Confirmed",
          note: "Everything is set. Arrive 10 minutes early for check-in.",
        }));
        dashboard.setSelectedBookingId(booking.id);
        dashboard.setActionMessage(`${booking.propertyTitle} marked as confirmed.`);
      },
      onBookingFocus: (booking: BookingItem) => {
        dashboard.setSelectedBookingId(booking.id);
        dashboard.setActionMessage(`Focused ${booking.propertyTitle} booking.`);
      },
      onBookingOpen: (booking: BookingItem) => {
        dashboard.setSelectedBookingId(booking.id);
        dashboard.setActionMessage(`Opened ${booking.propertyTitle} visit details.`);
      },
      onBookingReschedule: (booking: BookingItem) => {
        dashboard.updateBooking(booking.id, (current) => ({
          ...current,
          status: "Rescheduled",
          dateLabel: "Mon, Apr 7",
          timeLabel: "3:30 PM",
          note: "Visit moved to a later slot for easier access.",
        }));
        dashboard.setSelectedBookingId(booking.id);
        dashboard.setActionMessage(`${booking.propertyTitle} was rescheduled.`);
      },
      onFilterChange: dashboard.setActiveFilter,
      onHomeAction: dashboard.handleHomeAction,
      onHomeFilter: (home: Home) => {
        dashboard.setActiveFilter(home.bedrooms);
        dashboard.setActionMessage(`Filtered homes to ${home.bedrooms}.`);
      },
      onHomeSaveToggle: (home: Home, isSaved: boolean) => {
        dashboard.toggleSaved(home.id);
        dashboard.setActionMessage(
          isSaved
            ? `${home.title} removed from saved homes.`
            : `${home.title} saved for later.`
        );
      },
      onHomeSelect: (home: Home) => dashboard.setSelectedHomeId(home.id),
      onInsightPress: dashboard.handleInsightPress,
      onLocationPick: (location: string) => {
        dashboard.setSearchTerm(location);
        dashboard.setActionMessage(`Search narrowed to ${location}.`);
      },
      onResetView: dashboard.handleResetView,
      onSearchChange: dashboard.setSearchTerm,
      onTabChange: dashboard.setActiveTab,
      ...auth.dashboardAuthProps,
    },
  };
}
