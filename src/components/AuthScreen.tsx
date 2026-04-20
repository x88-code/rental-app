import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type {
  AuthMode,
  LoginForm,
  RegisterForm,
} from "../types/rental";

type AuthScreenProps = {
  authError: string;
  authMode: AuthMode;
  isLoading: boolean;
  loginForm: LoginForm;
  registerForm: RegisterForm;
  onAuthModeChange: (mode: AuthMode) => void;
  onLogin: () => void;
  onLoginFieldChange: (field: keyof LoginForm, value: string) => void;
  onRegister: () => void;
  onRegisterFieldChange: (field: keyof RegisterForm, value: string) => void;
};

const authModes: AuthMode[] = ["login", "register"];

export function AuthScreen({
  authError,
  authMode,
  isLoading,
  loginForm,
  registerForm,
  onAuthModeChange,
  onLogin,
  onLoginFieldChange,
  onRegister,
  onRegisterFieldChange,
}: AuthScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#f4efe7]">
      <View className="absolute left-[-40] top-10 h-40 w-40 rounded-full bg-[#f97316]/15" />
      <View className="absolute right-[-30] top-32 h-52 w-52 rounded-full bg-[#0f766e]/10" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-8 pt-4">
          <Text className="text-sm font-medium uppercase tracking-[2px] text-[#0f766e]">
            Rental App
          </Text>
          <Text className="mt-2 text-3xl font-black leading-9 text-[#111827]">
            {authMode === "login"
              ? "Log in to see your renter profile."
              : "Create an account and start tracking rentals."}
          </Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            Your signed-in details appear on the profile tab immediately after
            authentication.
          </Text>

          <View className="mt-6 flex-row rounded-[28px] bg-white p-2">
            {authModes.map((mode) => {
              const isActive = authMode === mode;

              return (
                <Pressable
                  key={mode}
                  onPress={() => onAuthModeChange(mode)}
                  className={`flex-1 rounded-[22px] px-4 py-3 ${
                    isActive ? "bg-[#111827]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-bold ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {mode === "login" ? "Login" : "Register"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-6 rounded-[30px] bg-white px-5 py-6">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
              {authMode === "login" ? "Welcome back" : "New account"}
            </Text>

            {authError ? (
              <View className="mt-4 rounded-[20px] bg-[#fff1f2] px-4 py-3">
                <Text className="text-sm font-semibold text-[#be123c]">
                  {authError}
                </Text>
              </View>
            ) : null}

            {authMode === "login" ? (
              <>
                <AuthField
                  label="Email"
                  value={loginForm.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  onChangeText={(value) => onLoginFieldChange("email", value)}
                />
                <AuthField
                  label="Password"
                  value={loginForm.password}
                  placeholder="At least 8 characters"
                  secureTextEntry
                  onChangeText={(value) => onLoginFieldChange("password", value)}
                />

                <Pressable
                  onPress={onLogin}
                  disabled={isLoading}
                  className="mt-5 rounded-full bg-[#111827] px-4 py-4"
                >
                  <Text className="text-center text-sm font-bold text-white">
                    {isLoading ? "Logging in..." : "Log in"}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <AuthField
                  label="First name"
                  value={registerForm.firstName}
                  onChangeText={(value) => onRegisterFieldChange("firstName", value)}
                />
                <AuthField
                  label="Last name"
                  value={registerForm.lastName}
                  onChangeText={(value) => onRegisterFieldChange("lastName", value)}
                />
                <AuthField
                  label="Email"
                  value={registerForm.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  onChangeText={(value) => onRegisterFieldChange("email", value)}
                />
                <AuthField
                  label="Phone"
                  value={registerForm.phone}
                  keyboardType="phone-pad"
                  placeholder="0700000000"
                  onChangeText={(value) => onRegisterFieldChange("phone", value)}
                />
                <AuthField
                  label="Preferred area"
                  value={registerForm.location}
                  placeholder="Westlands, Nairobi"
                  onChangeText={(value) => onRegisterFieldChange("location", value)}
                />
                <AuthField
                  label="Password"
                  value={registerForm.password}
                  placeholder="Create a password"
                  secureTextEntry
                  onChangeText={(value) => onRegisterFieldChange("password", value)}
                />
                <AuthField
                  label="Confirm password"
                  value={registerForm.confirmPassword}
                  placeholder="Repeat the password"
                  secureTextEntry
                  onChangeText={(value) =>
                    onRegisterFieldChange("confirmPassword", value)
                  }
                />

                <Pressable
                  onPress={onRegister}
                  disabled={isLoading}
                  className="mt-5 rounded-full bg-[#111827] px-4 py-4"
                >
                  <Text className="text-center text-sm font-bold text-white">
                    {isLoading ? "Creating account..." : "Create account"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "url"
    | "number-pad";
  placeholder?: string;
  secureTextEntry?: boolean;
};

function AuthField({
  label,
  value,
  onChangeText,
  autoCapitalize,
  keyboardType = "default",
  placeholder,
  secureTextEntry,
}: AuthFieldProps) {
  return (
    <View className="mt-4 rounded-[24px] bg-[#f8fafc] px-4 py-4">
      <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
        {label}
      </Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        className="mt-2 text-base font-medium text-slate-900"
        keyboardType={keyboardType}
        placeholder={placeholder ?? label}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
