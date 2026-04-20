import { useEffect, useMemo, useState } from "react";

import { initialActionMessage } from "../data/rentalData";
import type { ActiveTab, BookingItem, Home } from "../types/rental";
import { propertiesApi, bookingsApi, transformProperty, transformBooking } from "../services/api";

export function useRentalDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<ActiveTab>("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [savedHomes, setSavedHomes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState(initialActionMessage);
  const [properties, setProperties] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await propertiesApi.list();
        const homes = response.data.properties.map(transformProperty);
        setProperties(homes);
        if (homes.length > 0 && !selectedHomeId) {
          setSelectedHomeId(homes[0].id);
        }
      } catch (error) {
        setActionMessage("Failed to load properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getMyBookings();
      const transformedBookings = response.data.bookings.map(transformBooking);
      setBookings(transformedBookings);
      if (transformedBookings.length > 0 && !selectedBookingId) {
        setSelectedBookingId(transformedBookings[0].id);
      }
    } catch (error) {
      setActionMessage("Failed to load bookings.");
    }
  };

  useEffect(() => {
    if (activeTab === "Bookings" && bookings.length === 0) {
      fetchBookings();
    }
  }, [activeTab]);

  const featuredHomes = properties;

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

      return (activeTab !== "Saved" || savedHomes.includes(home.id)) &&
        matchesSearch &&
        matchesFilter;
    });
  }, [activeFilter, activeTab, savedHomes, searchTerm]);

  const locationSuggestions = useMemo(() => {
    const locations = [...new Set(featuredHomes.map((home) => home.area))];
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return normalizedSearch
      ? locations.filter((location) =>
          location.toLowerCase().includes(normalizedSearch)
        )
      : locations;
  }, [searchTerm]);

  useEffect(() => {
    if (filteredHomes.length && !filteredHomes.some((home) => home.id === selectedHomeId)) {
      setSelectedHomeId(filteredHomes[0].id);
    }
  }, [filteredHomes, selectedHomeId]);

  const displayedInsight =
    activeTab === "Saved"
      ? { label: "Saved homes", value: `${savedHomes.length} active` }
      : activeTab === "Bookings"
        ? { label: "Upcoming visits", value: `${bookings.length} tours` }
        : activeTab === "Profile"
          ? { label: "Profile", value: "92% complete" }
          : { label: "Available", value: "124 homes" };

  const updateBooking = (
    bookingId: string,
    updater: (booking: BookingItem) => BookingItem
  ) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? updater(booking) : booking
      )
    );
  };

  const toggleSaved = (homeId: string) => {
    setSavedHomes((current) =>
      current.includes(homeId)
        ? current.filter((id) => id !== homeId)
        : [...current, homeId]
    );
  };

  const handleHomeAction = (home: Home) => {
    const existingBooking = bookings.find(
      (booking) => booking.propertyTitle === home.title
    );
    setSelectedHomeId(home.id);

    if (existingBooking) {
      setActiveTab("Bookings");
      setSelectedBookingId(existingBooking.id);
      setActionMessage(`Opened the booking for ${home.title}.`);
      return;
    }

    const newBooking: BookingItem = {
      id: `booking-${home.id}-${Date.now()}`,
      propertyTitle: home.title,
      area: home.area,
      dateLabel: "Wed, Apr 9",
      timeLabel: "1:00 PM",
      status: "Pending",
      note: "Tour request created from the property card.",
    };

    setBookings((current) => [newBooking, ...current]);
    setActiveTab("Bookings");
    setSelectedBookingId(newBooking.id);
    setActionMessage(`Tour request created for ${home.title}.`);
  };

  const handleInsightPress = (label: string) => {
    if (label === "Saved homes" || label === "Saved this week") {
      setActiveTab("Saved");
      setActionMessage("Showing your saved homes.");
      return;
    }

    if (label === "Upcoming visits") {
      setActiveTab("Bookings");
      setActionMessage("Showing all upcoming bookings.");
      return;
    }

    if (label === "Profile") {
      setActiveTab("Profile");
      setActionMessage("Opened your profile details.");
      return;
    }

    if (label === "Average rent") {
      setActiveFilter("2 Bedroom");
      setActiveTab("Home");
      setActionMessage("Filtered homes to compare mid-range rentals.");
      return;
    }

    setActiveTab("Home");
    setActionMessage("Showing available homes.");
  };

  const handleResetView = () => {
    setActiveTab("Home");
    setSearchTerm("");
    setActiveFilter("All");
    setActionMessage("Dashboard reset to the main home feed.");
  };

  return {
    actionMessage,
    activeFilter,
    activeTab,
    bookings,
    displayedInsight,
    filteredHomes,
    isLoading,
    locationSuggestions,
    savedHomes,
    searchTerm,
    selectedBookingId,
    selectedHomeId,
    handleHomeAction,
    handleInsightPress,
    handleResetView,
    setActionMessage,
    setActiveFilter,
    setActiveTab,
    setBookings,
    setSearchTerm,
    setSelectedBookingId,
    setSelectedHomeId,
    toggleSaved,
    updateBooking,
  };
}
