import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { firestore } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  time: string;
};

type Day = {
  dateString: string;
};

const timeslots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + 1;
  const weekDates: {
    [key: string]: { selected: boolean; selectedColor: string };
  } = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(startOfWeek + i);
    const dateString = date.toISOString().split("T")[0];
    weekDates[dateString] = { selected: false, selectedColor: "orange" };
  }

  return weekDates;
};

const fetchAppointments = async (
  selectedDate: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const q = query(
    collection(firestore, "appointments"),
    where("appointmentDate", ">=", selectedDate)
  );
  const querySnapshot = await getDocs(q);
  const fetchedAppointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];

  const filteredAppointments = fetchedAppointments.filter((appt) =>
    appt.appointmentDate.startsWith(selectedDate)
  );
  setAppointments(filteredAppointments);
};

const bookAppointment = async (
  selectedDate: string,
  selectedTime: string,
  clientName: string,
  clientPhone: string,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    const appointmentRef = collection(firestore, "appointments");
    await addDoc(appointmentRef, {
      clientName,
      clientPhone,
      appointmentDate: `${selectedDate}`,
      time: `${selectedTime}`,
      status: "booked",
      createdAt: new Date().toString(),
    });
    alert("Wizyta została zarezerwowana!");
    setModalVisible(false);
    fetchAppointments(selectedDate, setAppointments); // Przekazujemy oba argumenty do fetchAppointments
  } catch (error) {
    console.error(error);
    alert("Wystąpił błąd podczas rezerwacji wizyty.");
  }
};

const deleteAppointment = async (
  id: string,
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    await deleteDoc(doc(firestore, "appointments", id));
    setAppointments(appointments.filter((appt) => appt.id !== id));
    Alert.alert("Usunięto wizytę");
  } catch (error) {
    console.error(error);
    alert("Błąd przy usuwaniu wizyty.");
  }
};

const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const weekDates = getWeekDates();

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate, setAppointments);
    }
  }, [selectedDate]);

  const handleDayPress = (day: Day) => {
    setSelectedDate(day.dateString); // `dateString` is a string of the selected date
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center px-4 my-6">
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...weekDates,
              [selectedDate ?? ""]: { selected: true, selectedColor: "orange" },
            }}
            hideExtraDays
            theme={calendarStyles}
            current={new Date().toISOString().split("T")[0]}
            minDate={new Date().toISOString().split("T")[0]}
            maxDate={
              new Date(new Date().setDate(new Date().getDate() + 60))
                .toISOString()
                .split("T")[0]
            }
          />

          {selectedDate && (
            <View className="mt-5">
              <Text className="text-lg font-bold text-white">
                Dostępne godziny
              </Text>
              <ScrollView horizontal className="mt-3">
                {timeslots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={{ backgroundColor: "#1E1E1E" }}
                    className={`p-3 mx-1 rounded-lg ${
                      selectedTime === time ? "bg-orange-500" : "bg-gray-700"
                    }`}
                    onPress={() => setSelectedTime(time)}>
                    <Text className="text-white">{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {selectedTime && (
                <Button
                  title="Dodaj wizytę"
                  onPress={() => setModalVisible(true)}
                />
              )}
            </View>
          )}

          <View className="mt-6">
            <Text className="text-lg font-bold text-white">
              Wizyty na {selectedDate}
            </Text>
            <ScrollView>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <TouchableOpacity
                    key={appt.id}
                    className=" p-3 my-2 rounded-lg"
                    style={{ backgroundColor: "#1E1E1E" }}
                    onPress={() =>
                      Alert.alert(
                        "Usuń wizytę",
                        `Czy na pewno chcesz usunąć wizytę ${appt.clientName}?`,
                        [
                          { text: "Anuluj", style: "cancel" },
                          {
                            text: "Usuń",
                            onPress: () =>
                              deleteAppointment(
                                appt.id,
                                appointments,
                                setAppointments
                              ),
                            style: "destructive",
                          },
                        ]
                      )
                    }>
                    <View className="text-white flex flex-row justify-between w-full gap-4 px-4 py-2">
                      <Text className="text-white">{appt.clientName}</Text>
                      <Text className="text-white">{appt.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-gray-400">Brak wizyt na ten dzień</Text>
              )}
            </ScrollView>
          </View>

          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View className="p-4">
              <TextInput
                placeholder="Imię klienta"
                value={clientName}
                onChangeText={setClientName}
                className="bg-gray-200 p-2 rounded-lg"
              />
              <TextInput
                placeholder="Numer telefonu"
                value={clientPhone}
                onChangeText={setClientPhone}
                className="bg-gray-200 p-2 rounded-lg mt-2"
              />
              <Button
                title="Zarezerwuj wizytę"
                onPress={() =>
                  bookAppointment(
                    selectedDate!, // Przekazujemy selectedDate
                    selectedTime, // Przekazujemy selectedTime
                    clientName, // Przekazujemy clientName
                    clientPhone, // Przekazujemy clientPhone
                    setModalVisible, // Przekazujemy setModalVisible
                    setAppointments // Przekazujemy setAppointments
                  )
                }
              />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const calendarStyles = {
  calendarBackground: "#1E1E1E",
  textSectionTitleColor: "#FFA500",
  selectedDayBackgroundColor: "#FFA500",
  selectedDayTextColor: "#FFFFFF",
  todayTextColor: "#FF4500",
  dayTextColor: "#999999",
  textDisabledColor: "#555555",
  arrowColor: "#FFA500",
  monthTextColor: "#FFFFFF",
};

export default AppointmentScheduler;
