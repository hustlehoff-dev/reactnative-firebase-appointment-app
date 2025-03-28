import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const confirmAppointment = functions.https.onRequest(
  async (req, res) => {
    const { appointmentId, action } = req.query;

    if (!appointmentId || !action) {
      res.status(400).send("Błąd: Brak wymaganych parametrów.");
      return;
    }

    try {
      const appointmentRef = db
        .collection("appointments")
        .doc(appointmentId as string);
      const appointment = await appointmentRef.get();

      if (!appointment.exists) {
        res.status(404).send("Wizyta nie istnieje.");
        return;
      }

      if (action === "confirm") {
        await appointmentRef.update({ status: "confirmed" });
        res.send("Twoja wizyta została potwierdzona! ✅");
      } else if (action === "cancel") {
        await appointmentRef.update({ status: "cancelled" });
        res.send("Twoja wizyta została anulowana. ❌");
      } else {
        res.status(400).send("Nieprawidłowa akcja.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Błąd serwera.");
    }
  }
);
