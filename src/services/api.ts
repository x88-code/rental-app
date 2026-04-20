// API Service for communicating with the backend

import { API_ENDPOINTS, getAuthToken, setAuthToken, clearAuthToken } from "../config/apiConfig";

// Types matching backend responses
export interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "tenant" | "landlord" | "admin";
  avatar?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    user: ApiUser;
  };
}

export interface ApiProperty {
  _id: string;
  title: string;
  description: string;
  propertyType: "bedsitter" | "studio" | "apartment" | "maisonette" | "single-room";
  status: "draft" | "available" | "occupied" | "inactive";
  price: number;
  bedrooms: number;
  bathrooms?: number;
  location: string;
  area: string;
  amenities?: string[];
  images?: string[];
  landlord: ApiUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesResponse {
  success: boolean;
  results: number;
  data: {
    properties: ApiProperty[];
  };
}

export interface PropertyResponse {
  success: boolean;
  data: {
    property: ApiProperty;
  };
}

export interface ApiBooking {
  _id: string;
  property: ApiProperty | string;
  tenant: ApiUser | string;
  landlord: ApiUser | string;
  requestedMoveInDate: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "allocated";
  allocatedUnitLabel?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  success: boolean;
  results: number;
  data: {
    bookings: ApiBooking[];
  };
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: {
    booking: ApiBooking;
  };
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    user: ApiUser;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Helper to make authenticated requests
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}

// Auth API
export const authApi = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: "tenant" | "landlord";
    location?: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      API_ENDPOINTS.auth.register,
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    );
    await setAuthToken(response.token);
    return response;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      API_ENDPOINTS.auth.login,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
    await setAuthToken(response.token);
    return response;
  },

  getProfile: async (): Promise<ProfileUpdateResponse> => {
    return apiRequest<ProfileUpdateResponse>(API_ENDPOINTS.auth.profile);
  },

  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    avatar?: string;
  }): Promise<ProfileUpdateResponse> => {
    return apiRequest<ProfileUpdateResponse>(
      API_ENDPOINTS.auth.updateProfile,
      {
        method: "PATCH",
        body: JSON.stringify(profileData),
      }
    );
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return apiRequest(API_ENDPOINTS.auth.changePassword, {
      method: "PATCH",
      body: JSON.stringify(passwordData),
    });
  },

  logout: async (): Promise<void> => {
    await clearAuthToken();
  },
};

// Properties API
export const propertiesApi = {
  list: async (params?: {
    search?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<PropertiesResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    const url = queryParams.toString()
      ? `${API_ENDPOINTS.properties.list}?${queryParams}`
      : API_ENDPOINTS.properties.list;
    return apiRequest<PropertiesResponse>(url);
  },

  get: async (id: string): Promise<PropertyResponse> => {
    return apiRequest<PropertyResponse>(API_ENDPOINTS.properties.get(id));
  },

  create: async (propertyData: Partial<ApiProperty>): Promise<PropertyResponse> => {
    return apiRequest<PropertyResponse>(API_ENDPOINTS.properties.create, {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
  },

  update: async (
    id: string,
    propertyData: Partial<ApiProperty>
  ): Promise<PropertyResponse> => {
    return apiRequest<PropertyResponse>(
      API_ENDPOINTS.properties.update(id),
      {
        method: "PATCH",
        body: JSON.stringify(propertyData),
      }
    );
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(API_ENDPOINTS.properties.delete(id), {
      method: "DELETE",
    });
  },
};

// Bookings API
export const bookingsApi = {
  getMyBookings: async (): Promise<BookingsResponse> => {
    return apiRequest<BookingsResponse>(API_ENDPOINTS.bookings.mine);
  },

  get: async (id: string): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.get(id));
  },

  create: async (bookingData: {
    propertyId: string;
    requestedMoveInDate: string;
    notes?: string;
  }): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.create, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  approve: async (id: string): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.approve(id), {
      method: "PATCH",
    });
  },

  reject: async (id: string): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.reject(id), {
      method: "PATCH",
    });
  },

  allocate: async (
    id: string,
    allocatedUnitLabel: string
  ): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.allocate(id), {
      method: "PATCH",
      body: JSON.stringify({ allocatedUnitLabel }),
    });
  },

  cancel: async (id: string): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>(API_ENDPOINTS.bookings.cancel(id), {
      method: "PATCH",
    });
  },
};

// Transform API responses to UI-friendly formats
export const transformProperty = (property: ApiProperty) => ({
  id: property._id,
  title: property.title,
  location: property.location,
  area: property.area,
  priceLabel: `KES ${property.price.toLocaleString()}`,
  tag: property.status === "available" ? "Available" : property.status,
  details: `${property.bedrooms} bed - ${property.propertyType}`,
  bedrooms: property.bedrooms === 1 ? "1 Bedroom" : property.bedrooms === 2 ? "2 Bedroom" : "Bedsitter",
  hasParking: property.amenities?.includes("parking") ?? false,
});

export const transformBooking = (booking: ApiBooking) => {
  const property = typeof booking.property === "object" ? booking.property : null;
  const date = new Date(booking.requestedMoveInDate);
  return {
    id: booking._id,
    propertyTitle: property?.title || "Property",
    area: property?.area || "",
    dateLabel: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    timeLabel: "10:00 AM",
    status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) as "Confirmed" | "Pending" | "Rescheduled",
    note: booking.notes || "",
  };
};

export const transformUser = (user: ApiUser) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  location: user.location || "",
});