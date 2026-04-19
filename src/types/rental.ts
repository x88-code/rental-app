export type ActiveTab = "Home" | "Saved" | "Bookings" | "Profile";

export type AuthMode = "login" | "register";

export type Home = {
  id: string;
  title: string;
  location: string;
  area: string;
  priceLabel: string;
  tag: string;
  details: string;
  bedrooms: string;
  hasParking: boolean;
};

export type BookingItem = {
  id: string;
  propertyTitle: string;
  area: string;
  dateLabel: string;
  timeLabel: string;
  status: "Confirmed" | "Pending" | "Rescheduled";
  note: string;
};

export type InsightItem = {
  label: string;
  value: string;
};

export type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
};

export type Account = ProfileForm & {
  id: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = ProfileForm & {
  password: string;
  confirmPassword: string;
};
