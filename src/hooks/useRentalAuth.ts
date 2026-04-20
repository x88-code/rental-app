import { useEffect, useMemo, useState } from "react";

import type {
  Account,
  ActiveTab,
  AuthMode,
  LoginForm,
  ProfileForm,
  RegisterForm,
} from "../types/rental";
import {
  authApi,
  transformUser,
  type ApiUser,
} from "../services/api";
import {
  emailPattern,
  emptyLoginForm,
  emptyProfile,
  emptyRegisterForm,
} from "../utils/auth";

type UseRentalAuthArgs = {
  setActionMessage: (message: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
};

export function useRentalAuth({
  setActionMessage,
  setActiveTab,
}: UseRentalAuthArgs) {
  const [authenticatedUser, setAuthenticatedUser] = useState<Account | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterForm>(emptyRegisterForm);

  useEffect(() => {
    if (!authenticatedUser) {
      setProfile(emptyProfile);
      setIsEditingProfile(false);
      return;
    }

    setProfile({
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      email: authenticatedUser.email,
      phone: authenticatedUser.phone,
      location: authenticatedUser.location,
    });
  }, [authenticatedUser]);

  const userInitials = `${profile.firstName.trim()[0] ?? "R"}${
    profile.lastName.trim()[0] ?? "A"
  }`;
  const displayName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Rental User";

  const updateLoginField = (field: keyof LoginForm, value: string) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
    setAuthError("");
  };

  const updateRegisterField = (field: keyof RegisterForm, value: string) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
    setAuthError("");
  };

  const updateProfileField = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleLogin = async () => {
    const normalizedEmail = loginForm.email.trim().toLowerCase();
    const normalizedPassword = loginForm.password.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setAuthError("Enter a valid email address.");
      return;
    }

    if (normalizedPassword.length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const response = await authApi.login({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      const user = transformUser(response.data.user);
      setAuthenticatedUser(user);
      setActiveTab("Home");
      setLoginForm(emptyLoginForm);
      setActionMessage(`${user.firstName} signed in. Home is ready.`);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerForm.password.trim().length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const response = await authApi.register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim().toLowerCase(),
        phone: registerForm.phone.trim(),
        password: registerForm.password,
        role: "tenant",
        location: registerForm.location.trim(),
      });

      const user = transformUser(response.data.user);
      setAuthenticatedUser(user);
      setActiveTab("Home");
      setAuthMode("login");
      setRegisterForm(emptyRegisterForm);
      setActionMessage(`${user.firstName} registered successfully. Welcome!`);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileEdit = async () => {
    if (!authenticatedUser) {
      return;
    }

    if (!isEditingProfile) {
      setIsEditingProfile(true);
      setActionMessage("Profile editing enabled.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.updateProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
        location: profile.location.trim(),
      });

      const updatedUser = transformUser(response.data.user);
      setAuthenticatedUser(updatedUser);
      setIsEditingProfile(false);
      setActionMessage("Profile updated successfully.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileReset = () => {
    if (!authenticatedUser) {
      return;
    }

    setProfile({
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      email: authenticatedUser.email,
      phone: authenticatedUser.phone,
      location: authenticatedUser.location,
    });
    setIsEditingProfile(false);
    setActionMessage("Profile changes cleared.");
  };

  const handleLogout = async () => {
    await authApi.logout();
    setAuthenticatedUser(null);
    setActiveTab("Home");
    setAuthMode("login");
    setAuthError("");
    setLoginForm(emptyLoginForm);
    setRegisterForm(emptyRegisterForm);
    setIsEditingProfile(false);
    setActionMessage("Signed out. Log in or create an account to continue.");
  };

  return {
    authenticatedUser,
    authScreenProps: {
      authError,
      authMode,
      isLoading,
      loginForm,
      registerForm,
      onAuthModeChange: setAuthMode,
      onLogin: handleLogin,
      onLoginFieldChange: updateLoginField,
      onRegister: handleRegister,
      onRegisterFieldChange: updateRegisterField,
    },
    dashboardAuthProps: {
      displayName,
      isEditingProfile,
      profile,
      userInitials,
      onLogout: handleLogout,
      onProfileEdit: handleProfileEdit,
      onProfileFieldChange: updateProfileField,
      onProfileReset: handleProfileReset,
    },
  };
}
