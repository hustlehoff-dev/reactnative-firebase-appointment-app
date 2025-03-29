const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Essa serwer działa!");
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});

// Twillio
require("dotenv").config();
const accountSid = process.env.TW_SID;
const authToken = process.env.TW_AUTH;
const number = process.env.TW_NUM;
const client = require("twilio")(accountSid, authToken);

// Wysylanie SMS

app.post("/send-confirmation", async (req, res) => {
  const { appointmentId, clientName, clientPhone } = req.body;
  const message = `Cześć ${clientName}, przypominamy o Twojej wizycie u barbera! Potwierdź ją klikając w poniższy link: http://localhost:3001/confirm-appointment/${appointmentId}`;
});

try {
  await client.message.create({
    body: message,
    from: number,
    to: clientPhone,
  });
  res.status(200).send("SMS wysłany!");
} catch (error) {
  console.error("Błąd wysyłania SMS: ", error);
  res.status(500).send("Błąd podczas wysyłania SMS");
}

/*
client.messages
  .create({
    body: "Hello from Node Essa byku",
    from: number,
    to: "+18777804236",
  })
  .then((message) => console.log(message.sid));*/
