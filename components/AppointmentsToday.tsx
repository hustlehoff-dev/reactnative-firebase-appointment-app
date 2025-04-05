import {
  StyleSheet,
  Text,
  View,
  SectionListRenderItemInfo,
  Linking,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AgendaList, CalendarProvider } from "react-native-calendars";
import {
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

interface Appointment {
  id: string;
  appointmentDate: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  status: string;
  time: string;
}
interface selDateType {
  selectedDate: string;
}

const AppointmentsToday = ({ selectedDate }: selDateType) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const appointmentsRef = collection(firestore, "appointments");

    const q = query(
      appointmentsRef,
      where("appointmentDate", "==", selectedDate),
      orderBy("appointmentDate", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedAppointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment);
      });

      // Debugowanie
      console.log("Fetched appointments:", fetchedAppointments);
      if (fetchedAppointments.length === 0) {
        console.log("No appointments found for selectedDate:", selectedDate);
      }

      // Format appointments into sections, update state
      const groupedAppointments: { [key: string]: Appointment[] } =
        fetchedAppointments.reduce(
          (acc: { [key: string]: Appointment[] }, appointment: Appointment) => {
            const date = appointment.appointmentDate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(appointment);
            return acc;
          },
          {}
        );

      const sectionsData = Object.keys(groupedAppointments).map((date) => ({
        title: date,
        data: groupedAppointments[date],
      }));

      setSections(sectionsData);
      setAppointments(fetchedAppointments);
      setLoading(false);
    });

    // Return unsub function when component unmounts
    return () => unsubscribe();
  }, [selectedDate]);

  // Visit Call
  const handleCall = (phonenumber: string) => {
    const url = `tel:${phonenumber}`;
    Linking.openURL(url).catch((err) => console.error("Błąd połączenia:", err));
  };

  // Visit Delete
  const handleDelete = (appointmentId: string) => {
    const appointmentRef = doc(firestore, "appointments", appointmentId);
    deleteDoc(appointmentRef)
      .then(() => {
        console.log("Wizyta usunięta!");
      })
      .catch((err) => {
        console.error("Błąd przy usuwaniu wizyty:", err);
      });
  };

  const renderAgendaItem = ({
    item,
  }: SectionListRenderItemInfo<Appointment>) => {
    console.log("Rendering item:", item);
    return (
      <View style={styles.appointmentItem}>
        <View className="flex flex-row justify-between">
          <View className="flex justify-center ">
            <Text style={styles.appointmentText}>{item.clientName}</Text>
            <Text style={styles.appointmentText}>{item.clientPhone}</Text>
          </View>
          <View className="flex justify-center items-end ">
            <Text
              style={[
                styles.statusText,
                item.status === "booked" && { color: "#FF7F00" },
                item.status === "confirmed" && { color: "green" },
                item.status === "cancelled" && { color: "red" },
              ]}>
              {item.status === "booked"
                ? "Umówiona"
                : item.status === "confirmed"
                ? "Potwierdzona"
                : item.status === "cancelled"
                ? "Anulowana"
                : "Status nieznany"}
            </Text>
            <Text
              style={[
                styles.timeText,
                item.status === "booked" && { color: "#FF7F00" },
                item.status === "confirmed" && { color: "green" },
                item.status === "cancelled" && { color: "red" },
              ]}>
              {item.time}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            className="py-2 px-5 bg-secondary-100 rounded-lg"
            onPress={() => handleCall(item.clientPhone)}>
            <Text className="text-black font-semibold text-lg uppercase w-full">
              Dzwoń
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2 px-4 bg-secondary-100 rounded-lg"
            onPress={() => handleDelete(item.id)}>
            <Text className="text-black font-semibold text-lg uppercase w-full">
              Usuń
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarProvider date={selectedDate}>
        <AgendaList sections={sections} renderItem={renderAgendaItem} />
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default AppointmentsToday;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark mode background
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "psemibold",
    color: "#FFFFFF",
  },
  appointmentItem: {
    padding: 16,
    backgroundColor: "#1E1E1E", // Ciemniejsze tło dla kart
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#212121", // Akcentująca obwódka
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appointmentText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#c2c2c2", // Jasny tekst dla czytelności
    marginBottom: 2,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#FFA001", // Akcentowany kolor dla godziny wizyty
  },
  statusText: {
    fontSize: 24,
    fontWeight: 600,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
