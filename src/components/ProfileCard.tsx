import type { ReactNode } from "react";

import { Pressable, Text, TextInput, View } from "react-native";

import type { ProfileForm } from "../types/rental";

type ProfileCardProps = {
  displayName: string;
  isEditingProfile: boolean;
  profile: ProfileForm;
  onLogout: () => void;
  onProfileEdit: () => void;
  onProfileFieldChange: (field: keyof ProfileForm, value: string) => void;
  onProfileReset: () => void;
};

export function ProfileCard({
  displayName,
  isEditingProfile,
  profile,
  onLogout,
  onProfileEdit,
  onProfileFieldChange,
  onProfileReset,
}: ProfileCardProps) {
  return (
    <View className="mt-5 rounded-3xl bg-white px-4 py-4">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
        Profile
      </Text>
      <Text className="mt-2 text-lg font-black text-slate-900">{displayName}</Text>
      <Text className="mt-1 text-sm text-slate-500">{profile.email}</Text>
      <Text className="mt-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#0f766e]">
        Signed in account
      </Text>

      <ProfileField label="Phone">
        {isEditingProfile ? (
          <TextInput
            className="mt-2 text-base font-medium text-slate-900"
            keyboardType="phone-pad"
            placeholder="0700000000"
            placeholderTextColor="#94a3b8"
            value={profile.phone}
            onChangeText={(value) => onProfileFieldChange("phone", value)}
          />
        ) : (
          <Text className="mt-2 text-base font-medium text-slate-900">
            {profile.phone}
          </Text>
        )}
      </ProfileField>

      <ProfileField label="Preferred area">
        {isEditingProfile ? (
          <TextInput
            className="mt-2 text-base font-medium text-slate-900"
            placeholder="Westlands, Nairobi"
            placeholderTextColor="#94a3b8"
            value={profile.location}
            onChangeText={(value) => onProfileFieldChange("location", value)}
          />
        ) : (
          <Text className="mt-2 text-base font-medium text-slate-900">
            {profile.location}
          </Text>
        )}
      </ProfileField>

      <ProfileField label="Name">
        {isEditingProfile ? (
          <View className="mt-2">
            <TextInput
              className="text-base font-medium text-slate-900"
              placeholder="First name"
              placeholderTextColor="#94a3b8"
              value={profile.firstName}
              onChangeText={(value) => onProfileFieldChange("firstName", value)}
            />
            <TextInput
              className="mt-3 text-base font-medium text-slate-900"
              placeholder="Last name"
              placeholderTextColor="#94a3b8"
              value={profile.lastName}
              onChangeText={(value) => onProfileFieldChange("lastName", value)}
            />
          </View>
        ) : (
          <Text className="mt-2 text-base font-medium text-slate-900">
            {displayName}
          </Text>
        )}
      </ProfileField>

      <View className="mt-5">
        <Pressable
          onPress={onProfileEdit}
          className="rounded-full bg-[#111827] px-4 py-3"
        >
          <Text className="text-sm font-bold text-white">
            {isEditingProfile ? "Save" : "Edit profile"}
          </Text>
        </Pressable>
        <Pressable
          onPress={onProfileReset}
          className="mt-3 rounded-full bg-[#fff7ed] px-4 py-3"
        >
          <Text className="text-sm font-bold text-[#c2410c]">Discard</Text>
        </Pressable>
        <Pressable
          onPress={onLogout}
          className="mt-3 rounded-full bg-[#ecfeff] px-4 py-3"
        >
          <Text className="text-sm font-bold text-[#0f766e]">Log out</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ProfileFieldProps = {
  children: ReactNode;
  label: string;
};

function ProfileField({ children, label }: ProfileFieldProps) {
  return (
    <View className="mt-4 rounded-[26px] bg-[#f8fafc] px-4 py-4">
      <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
        {label}
      </Text>
      {children}
    </View>
  );
}
