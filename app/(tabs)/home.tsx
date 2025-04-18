import { Button, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HomeWidgets from "@/components/homewidgets";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import AppointmentsToday from "@/components/AppointmentsToday";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

const getCurrentDate = () => {
  const now = new Date();
  const hours = now.getHours();

  // After 18:00 set next day
  if (hours >= 18) {
    now.setDate(now.getDate() + 1); // next day
  }
  // If before 18, set today
  return now;
};

const home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentDate());

  useEffect(() => {
    setSelectedDate(getCurrentDate());
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full px-4 ">
      <AppointmentsToday selectedDate={selectedDate} />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
