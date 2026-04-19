import type { Account, LoginForm, ProfileForm, RegisterForm } from "../types/rental";

export const emailPattern = /^\S+@\S+\.\S+$/;

export const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
};

export const emptyLoginForm: LoginForm = {
  email: "",
  password: "",
};

export const emptyRegisterForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  password: "",
  confirmPassword: "",
};

export const createProfileFromAccount = (account: Account): ProfileForm => ({
  firstName: account.firstName,
  lastName: account.lastName,
  email: account.email,
  phone: account.phone,
  location: account.location,
});

export const validateProfileForm = (form: ProfileForm) => {
  if (form.firstName.trim().length < 2) {
    return "First name must be at least 2 characters.";
  }

  if (form.lastName.trim().length < 2) {
    return "Last name must be at least 2 characters.";
  }

  if (!emailPattern.test(form.email.trim().toLowerCase())) {
    return "Enter a valid email address.";
  }

  if (form.phone.trim().length < 7) {
    return "Enter a valid phone number.";
  }

  if (form.location.trim().length < 3) {
    return "Preferred area must be at least 3 characters.";
  }

  return "";
};
