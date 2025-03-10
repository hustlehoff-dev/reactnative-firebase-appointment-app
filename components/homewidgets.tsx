import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
} from "react-native-calendars";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { LogBox } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
LogBox.ignoreLogs(["Support for defaultProps will be removed"]);

const HomeWidgets = () => {
  const [appointments, setAppointments] = useState<
    { id: string; clientName: string; appointmentDate: string }[]
  >([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "appointments")
        );
        const fetchedAppointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; clientName: string; appointmentDate: string }[];

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Błąd pobierania wizyt:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Formatowanie danych do Agendy
  const appointmentsByDate = appointments.reduce((acc, appt) => {
    const date = appt.appointmentDate.split(" ")[0]; // Pobranie samej daty (bez godziny)
    if (!acc[date]) acc[date] = [];
    acc[date].push(appt);
    return acc;
  }, {} as Record<string, { id: string; clientName: string; appointmentDate: string }[]>);

  return (
    <SafeAreaView className="w-full h-full flex justify-center px-2">
      <CalendarProvider date={today}>
        <ExpandableCalendar
          hideArrows={false}
          disablePan={false}
          firstDay={1}
          markedDates={{ [today]: { selected: true, selectedColor: "orange" } }}
          theme={calendarStyles}
          hideExtraDays={true}
          minDate="2025-03-08"
          maxDate=""
        />
        <AgendaList
          sections={Object.keys(appointmentsByDate).map((date) => ({
            title: date,
            data: appointmentsByDate[date],
          }))}
          renderItem={({ item }) => (
            <View className="bg-gray-800 p-3 my-2 rounded-lg">
              <Text className="text-white">
                {item.clientName} - {item.appointmentDate}
              </Text>
            </View>
          )}
          sectionStyle={{ backgroundColor: "#121212", paddingVertical: 10 }}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default HomeWidgets;

const calendarStyles = {
  calendarBackground: "#1E1E1E",
  textSectionTitleColor: "#FFA500",
  selectedDayBackgroundColor: "rgba(255,255,255,0.5)",
  selectedDayTextColor: "#FFFFFF",
  todayTextColor: "#FF4500",
  dayTextColor: "#999999",
  textDisabledColor: "#555555",
  arrowColor: "#FFA500",
  monthTextColor: "#FFFFFF",
};
