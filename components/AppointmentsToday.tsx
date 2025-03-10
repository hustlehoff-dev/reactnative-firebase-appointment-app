import {
  StyleSheet,
  Text,
  View,
  SectionListRenderItemInfo,
  Linking,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AgendaList, CalendarProvider } from "react-native-calendars";
import { format } from "date-fns";
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

// Po zmianie daty w home.tsx, uzyc zeby aktualizowac dany dzień i wyswietlac agende wizyt dla konkretnego dnia
const today = format(new Date(), "yyyy-MM-dd");

/*const fetchAppointmentsForDay = async () => {
  const appointmentsRef = collection(firestore, "appointments");

  const q = query(
    appointmentsRef,
    where("appointmentDate", "==", day),
    orderBy("appointmentDate", "asc")
  );

  try {
    const querySnapshot = await getDocs(q);
  } catch (err){

  }
};*/
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
        <Text style={styles.appointmentText}>{item.clientName}</Text>
        <Text style={styles.appointmentText}>{item.clientPhone}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Call" onPress={() => handleCall(item.clientPhone)} />
          <Button title="Delete" onPress={() => handleDelete(item.id)} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text className="text-white">
        {loading ? "Loading..." : "Appointments"}
      </Text>
      <CalendarProvider date={today}>
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
    fontSize: 16,
    fontFamily: "pregular",
    color: "#FFFFFF", // Jasny tekst dla czytelności
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    fontFamily: "pmedium",
    color: "#FFA001", // Akcentowany kolor dla godziny wizyty
  },
  statusText: {
    fontSize: 14,
    fontFamily: "pmedium",
    color: "#FF7F00", // Secondary 100 dla statusu
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
