import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentsToday from "@/components/AppointmentsToday";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

const getCurrentDate = () => {
  const now = new Date();
  const hours = now.getHours();

  // After 18:00 set next day
  if (hours >= 18) {
    now.setDate(now.getDate() + 1); // next day
  }
  // If before 18, set today
  return format(now, "yyyy-MM-dd");
};

const home = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setSelectedDate(getCurrentDate());
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full px-4 ">
      <AppointmentsToday selectedDate={selectedDate} />
      {/* Brak pickera, na razie data tylko dynamicznie */}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
