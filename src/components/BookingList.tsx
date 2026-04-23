import { Pressable, Text, View } from "react-native";

import type { BookingItem } from "../types/rental";

type BookingListProps = {
  bookings: BookingItem[];
  selectedBookingId: string | null;
  onBookingCancel: (booking: BookingItem) => void;
  onBookingConfirm: (booking: BookingItem) => void;
  onBookingFocus: (booking: BookingItem) => void;
  onBookingOpen: (booking: BookingItem) => void;
  onBookingReschedule: (booking: BookingItem) => void;
};

export function BookingList({
  bookings,
  selectedBookingId,
  onBookingCancel,
  onBookingConfirm,
  onBookingFocus,
  onBookingOpen,
  onBookingReschedule,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <View className="mt-4 rounded-[30px] bg-white px-5 py-10">
        <Text className="text-xl font-black text-slate-900">
          No bookings scheduled.
        </Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500">
          Save a home and add a tour later when you are ready to test the booking
          flow again.
        </Text>
      </View>
    );
  }

  return (
    <>
      {bookings.map((booking) => {
        const statusBadgeClassName =
          booking.status === "Confirmed"
            ? "rounded-full bg-[#dcfce7] px-3 py-2"
            : booking.status === "Pending"
              ? "rounded-full bg-[#fef3c7] px-3 py-2"
              : "rounded-full bg-[#e0f2fe] px-3 py-2";
        const statusTextClassName =
          booking.status === "Confirmed"
            ? "text-xs font-bold uppercase tracking-[1.5px] text-[#166534]"
            : booking.status === "Pending"
              ? "text-xs font-bold uppercase tracking-[1.5px] text-[#92400e]"
              : "text-xs font-bold uppercase tracking-[1.5px] text-[#0f766e]";
        const isSelected = selectedBookingId === booking.id;
        const visitCardClassName = isSelected
          ? "mt-5 rounded-[26px] bg-[#ecfeff] px-4 py-4"
          : "mt-5 rounded-[26px] bg-[#f8fafc] px-4 py-4";

        return (
          <View
            key={booking.id}
            className="mt-4 rounded-[30px] bg-white px-5 py-5"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-2xl font-black text-slate-900">
                  {booking.propertyTitle}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">{booking.area}</Text>
              </View>

              <Pressable
                onPress={() => onBookingFocus(booking)}
                className={statusBadgeClassName}
              >
                <Text className={statusTextClassName}>
                  {booking.status}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => onBookingOpen(booking)}
              className={visitCardClassName}
            >
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-slate-400">
                Scheduled visit
              </Text>
              <Text className="mt-2 text-lg font-black text-slate-900">
                {booking.dateLabel} at {booking.timeLabel}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                {booking.note}
              </Text>
            </Pressable>

            <View className="mt-5 flex-row justify-between">
              <ActionButton
                label="Confirm"
                textClassName="text-sm font-bold text-white"
                className="rounded-full bg-[#111827] px-4 py-3"
                onPress={() => onBookingConfirm(booking)}
              />
              <ActionButton
                label="Reschedule"
                textClassName="text-sm font-bold text-[#0f766e]"
                className="rounded-full bg-[#ecfeff] px-4 py-3"
                onPress={() => onBookingReschedule(booking)}
              />
              <ActionButton
                label="Cancel"
                textClassName="text-sm font-bold text-[#be123c]"
                className="rounded-full bg-[#fff1f2] px-4 py-3"
                onPress={() => onBookingCancel(booking)}
              />
            </View>
          </View>
        );
      })}
    </>
  );
}

type ActionButtonProps = {
  className: string;
  label: string;
  textClassName: string;
  onPress: () => void;
};

function ActionButton({
  className,
  label,
  textClassName,
  onPress,
}: ActionButtonProps) {
  return (
    <Pressable onPress={onPress} className={className}>
      <Text className={textClassName}>{label}</Text>
    </Pressable>
  );
}
