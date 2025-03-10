import { StyleSheet, Text, View } from "react-native";
import React from "react";
import HomeWidgets from "@/components/homewidgets";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import AppointmentsToday from "@/components/AppointmentsToday";

const home = () => {
  return (
    <SafeAreaView className="bg-primary h-full px-4 ">
      <AppointmentsToday selectedDate="2025-03-15" />{" "}
      {/* Zmienic na date dnia "dzisiejszego" zeby dzialalo z automatu */}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
