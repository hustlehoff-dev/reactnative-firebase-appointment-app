import { StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import SendSMS from "react-native-sms";

const getAppointmentsTommorow = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = format(tomorrow, "yyyy-MM-dd");

  const q = query(
    collection(firestore, "appointments"),
    where("appointmentDate", "==", tomorrowString)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    clientName: doc.data().clientName,
    clientPhone: doc.data().clientPhone,
  }));
};

const sendBulkSMS = async () => {
  const appointments = await getAppointmentsTommorow();

  appointments.forEach(({ clientPhone, clientName }) => {
    const message = `Cześć ${clientName}! Przypominamy o Twojej wizycie u barbera jutro. Potwierdź tutaj:`;

    SendSMS.send({
      body: message,
      recipients: [clientPhone],
      successTypes: ["sent", "queued"],
    }),
      (completed: boolean, cancelled: boolean, error: string | undefined) => {
        if (completed) console.log("SMSy wysłane!");
        if (cancelled) console.log("SMSy anulowane!");
        if (error) console.log(`Błąd wysyłania SMS: ${error}`);
      };
  });
};

const SendConfirmation = () => {
  return (
    <View>
      <Text>SendConfirmation</Text>
    </View>
  );
};

export default SendConfirmation;

const styles = StyleSheet.create({});
