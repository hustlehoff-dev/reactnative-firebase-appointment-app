# EssaBarber - Mobile Appointment App (Discontinued)

////////////////////////
X The project development as mobile app is discontinued. X
X Developing it as a web application here: https://github.com/hustlehoff-dev/essabook-react-typescript-firebase-appointmentapp
////////////////////////

Essa Barber is my first commercial product, a mobile application designed for barbershop owners to manage client appointments efficiently.

The project will offer subscription model for owners of service premises in exchange of the most convienient customer relation management system in the industry.

## Screenshots

![App's hello page](image.png)
![App's appointment calendar](image-1.png)
![App's agenda view](image-2.png)

## Current Project State (updated: 4.04.2025 2:24CET)

**What's working:**

- User can now book/remove appointments.
- Booked appointments appear on the app's homepage as a handy list (agenda). From there, the user can call the client with one tap.
- After booking, the app sends an SMS to inform the client about the appointment.
- 12 or 24 hours before the appointment, the user gets a reminder SMS that allows them to confirm or cancel the visit.
- Each appointment starts with the "booked" status. It can later change to "confirmed" or "cancelled".

**What's being added:**

- Blacklist: lets the user ban problematic contacts (those who cancel or no-show).
- Phone contacts sync: integrates the app with the user's phonebook. Allows user to add new booking in no time (without need to input clients data by hand).

## Key Features

- Appointment booking system with date, time, and time slot selection.
- Automated SMS notifications for appointment confirmation and reminders.
- User authentication with Firebase Authentication.
- Data storage using Firestore Database.
- Decentralized server handles booking states/reminders.

## Technologies

- React Native + Expo
- TailwindCSS
- FirebaseAPI (Firestore, Authentication, AdminSDK)
- TwilioAPI (SMS notifications)
- ExpressJS backend (handling SMS notifications, reminders and booking status)

Project is under development.

### Further development

- Convienient webapp with control panel/subscription info (apart from mobile app)
- Marketing CRM.
- Statistic dashboard, analyzer.

At the moment:

- Implementation of Express.js standalone server for sms/appointment confirmations handling.
