import type {
  Account,
  ActiveTab,
  BookingItem,
  Home,
  InsightItem,
} from "../types/rental";

export const quickFilters = [
  "All",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedroom",
  "Parking",
];

export const featuredHomes: Home[] = [
  {
    id: "sunset",
    title: "Sunset Residency",
    location: "Westlands, Nairobi",
    area: "Westlands",
    priceLabel: "KES 38,000",
    tag: "Popular",
    details: "1 bed - Wi-Fi - Security",
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
    details: "2 bed - Parking - Balcony",
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
    details: "Studio - Water included",
    bedrooms: "Bedsitter",
    hasParking: false,
  },
];

export const bookingItems: BookingItem[] = [
  {
    id: "booking-sunset",
    propertyTitle: "Sunset Residency",
    area: "Westlands",
    dateLabel: "Tue, Apr 1",
    timeLabel: "10:30 AM",
    status: "Confirmed",
    note: "Meet caretaker at the main gate.",
  },
  {
    id: "booking-ivy",
    propertyTitle: "Ivy Heights",
    area: "Kilimani",
    dateLabel: "Thu, Apr 3",
    timeLabel: "2:00 PM",
    status: "Pending",
    note: "Landlord will confirm parking access.",
  },
  {
    id: "booking-harbor",
    propertyTitle: "Harbor Court",
    area: "South B",
    dateLabel: "Sat, Apr 5",
    timeLabel: "11:15 AM",
    status: "Rescheduled",
    note: "Agent requested a later arrival window.",
  },
];

export const insights: InsightItem[] = [
  { label: "Available", value: "124 homes" },
  { label: "Saved this week", value: "18 listings" },
  { label: "Average rent", value: "KES 41k" },
];

export const navItems: ActiveTab[] = ["Home", "Saved", "Bookings", "Profile"];

export const demoAccount: Account = {
  id: "account-demo",
  firstName: "Shadow",
  lastName: "Strike",
  email: "xgh@gmail.com",
  phone: "0700000000",
  location: "Westlands, Nairobi",
  password: "password123",
};

export const initialActionMessage =
  "Tap any card, chip, or action to explore the demo flow.";
