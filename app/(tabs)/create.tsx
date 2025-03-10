import { View, Text } from "react-native";
import React from "react";
import AppointmentScheduler from "@/components/CalendarByDay";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Create = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <AppointmentScheduler />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
