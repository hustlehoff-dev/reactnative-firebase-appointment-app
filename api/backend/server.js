import express from "express";
import admin from "firebase-admin";
const app = express();
const port = 3001;

import cors from "cors";

app.use(cors());

// Initialize Firebase Admin
import fs from "fs/promises";
const serviceAccount = JSON.parse(
  await fs.readFile(new URL("./../essabarber-adminsdk.json", import.meta.url))
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Twillio
import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();
const client = twilio(process.env.TW_SID, process.env.TW_AUTH);
const numberTwilio = process.env.TW_NUM;

// Parse data as json
app.use(express.json());

// Appointment booked endpoint
app.post("/add-appointment", async (req, res) => {
  const { clientName, clientPhone, appointmentDate, time } = req.body;

  // Wyślij SMS
  const message = `Cześć ${clientName}, Twoja wizyta została zarezerwowana na ${appointmentDate} o ${time}.`;
  const phoneNumber = clientPhone.startsWith("+")
    ? clientPhone
    : `+48${clientPhone}`;

  try {
    await client.messages.create({
      body: message,
      from: numberTwilio,
      to: phoneNumber,
    });
    res.status(200).send("Wizyta dodana i SMS wysłany");
  } catch (error) {
    console.error("Błąd wysyłania SMS: ", error);
    res.status(500).send("Błąd podczas wysyłania SMS");
  }
});

// Confirmation endpoint
app.get("/confirm/:id", async (req, res) => {
  console.log("Otrzymane ID wizyty:", req.params.id);
  const appointmentId = req.params.id;

  try {
    const appointmentRef = db.collection("appointments").doc(appointmentId);
    const doc = await appointmentRef.get();

    if (!doc.exists) {
      return res.status(404).send("Nie znaleziono wizyty.");
    }

    await appointmentRef.update({ status: "confirmed" });
    res.status(200).send("Wizyta potwierdzona!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd przy potwierdzaniu wizyty.");
  }
});

// Cancellation endpoint
app.get("/cancel/:id", async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointmentRef = db.collection("appointments").doc(appointmentId);
    const doc = await appointmentRef.get();

    if (!doc.exists) {
      return res.status(404).send("Nie znaleziono wizyty.");
    }

    await appointmentRef.update({ status: "cancelled" });
    res.status(200).send("Wizyta anulowana!");
  } catch (error) {
    console.error(error);
    res.status(200).send("Błąd przy anulowaniu wizity.");
  }
});

// Schedule daily reminders
import cron from "node-cron";
cron.schedule("59 22 * * *", async () => {
  const now = new Date();
  now.setDate(now.getDate() + 1); // Jutro
  const tomorrowDate = now.toISOString().split("T")[0];

  try {
    const snapshot = await db
      .collection("appointments")
      .where("appointmentDate", "==", tomorrowDate)
      .where("status", "==", "booked")
      .get();

    snapshot.forEach(async (doc) => {
      const appointment = doc.data();
      const { clientName, clientPhone } = appointment;

      const message = `Potwierdź: http://api.essabarber.pl/confirm/${doc.id} 
      Anuluj: http://api.essabarber.pl/cancel/${doc.id}`;

      await client.messages.create({
        body: message,
        from: numberTwilio,
        to: clientPhone,
      });

      console.log(`Przypomnienie wysłane do ${clientName}`);
    });
  } catch (error) {
    console.error("Błąd przy wysyłaniu przypomnień:", error);
  }
});

// Live info
app.get("/", (req, res) => {
  res.send("Essa serwer działa!");
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
