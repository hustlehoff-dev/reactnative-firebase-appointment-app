// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Replace with your Firebase project's configuration details
const firebaseConfig = {
  apiKey: "AIzaSyARSCl1dn8uX0WaaI3lgGvXKT4W9OgIUwU",
  authDomain: "essabarber-app.firebaseapp.com",
  projectId: "essabarber-app",
  storageBucket: "essabarber-app.appspot.com",
  messagingSenderId: "550178930057",
  appId: "1:550178930057:android:4cc686ede793c9c4f23558",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
