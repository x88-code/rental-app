import { useEffect, useMemo, useState } from "react";

import { demoAccount } from "../data/rentalData";
import type {
  Account,
  ActiveTab,
  AuthMode,
  LoginForm,
  ProfileForm,
  RegisterForm,
} from "../types/rental";
import {
  createProfileFromAccount,
  emailPattern,
  emptyLoginForm,
  emptyProfile,
  emptyRegisterForm,
  validateProfileForm,
} from "../utils/auth";

type UseRentalAuthArgs = {
  setActionMessage: (message: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
};

export function useRentalAuth({
  setActionMessage,
  setActiveTab,
}: UseRentalAuthArgs) {
  const [accounts, setAccounts] = useState<Account[]>([demoAccount]);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState("");
  const [loginForm, setLoginForm] = useState<LoginForm>(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterForm>(emptyRegisterForm);

  const authenticatedUser = useMemo(
    () => accounts.find((account) => account.id === authenticatedUserId) ?? null,
    [accounts, authenticatedUserId]
  );

  useEffect(() => {
    if (!authenticatedUser) {
      setProfile(emptyProfile);
      setIsEditingProfile(false);
      return;
    }

    setProfile(createProfileFromAccount(authenticatedUser));
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

  const handleLogin = () => {
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

    const matchedAccount = accounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === normalizedPassword
    );

    if (!matchedAccount) {
      setAuthError("Invalid email or password.");
      return;
    }

    setAuthenticatedUserId(matchedAccount.id);
    setActiveTab("Home");
    setLoginForm(emptyLoginForm);
    setAuthError("");
    setActionMessage(
      `${matchedAccount.firstName} signed in. Home is ready, and profile shows this account.`
    );
  };

  const handleRegister = () => {
    const validationError = validateProfileForm({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      phone: registerForm.phone,
      location: registerForm.location,
    });

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    if (registerForm.password.trim().length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const normalizedEmail = registerForm.email.trim().toLowerCase();
    const normalizedPhone = registerForm.phone.trim();
    const duplicateAccount = accounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail ||
        account.phone === normalizedPhone
    );

    if (duplicateAccount) {
      setAuthError("An account with this email or phone already exists.");
      return;
    }

    const newAccount: Account = {
      id: `account-${Date.now()}`,
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      location: registerForm.location.trim(),
      password: registerForm.password,
    };

    setAccounts((current) => [...current, newAccount]);
    setAuthenticatedUserId(newAccount.id);
    setActiveTab("Home");
    setAuthMode("login");
    setAuthError("");
    setRegisterForm(emptyRegisterForm);
    setActionMessage(
      `${newAccount.firstName} registered successfully. Home is ready, and profile shows this account.`
    );
  };

  const handleProfileEdit = () => {
    if (!authenticatedUserId) {
      return;
    }

    if (!isEditingProfile) {
      setIsEditingProfile(true);
      setActionMessage("Profile editing enabled.");
      return;
    }

    const validationError = validateProfileForm(profile);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    const nextProfile = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
    };

    setAccounts((current) =>
      current.map((account) =>
        account.id === authenticatedUserId ? { ...account, ...nextProfile } : account
      )
    );
    setIsEditingProfile(false);
    setActionMessage("Profile updated for the signed-in account.");
  };

  const handleProfileReset = () => {
    if (!authenticatedUser) {
      return;
    }

    setProfile(createProfileFromAccount(authenticatedUser));
    setIsEditingProfile(false);
    setActionMessage("Profile changes cleared.");
  };

  const handleLogout = () => {
    setAuthenticatedUserId(null);
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
      demoAccount,
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
