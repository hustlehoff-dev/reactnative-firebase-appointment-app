import { View, Text, Image, Alert } from "react-native";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router, Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { images } from "../../constants";
import { useAuth } from "@/context/AuthProvider";
import FormField from "../../components/formfield";
import CustomButton from "../../components/custombutton";

const SignIn = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Redirect href="/(tabs)/home" />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Podaj dane logowania");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logoSmall}
            className="w-[85px] h-[85px]"
            resizeMode="contain"
          />
          <Image source={images.logo} className="w-[115px] h-[115px]" />
          <Text className="text-2xl text-white text-semibold mt-10">
            Logowanko
          </Text>
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-adress"
            placeholder=""
          />
          <FormField
            title="Hasło"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-7"
            keyboardType="password"
            placeholder=""
          />

          <CustomButton
            title="Zaloguj"
            handlePress={signIn}
            containerStyles=" mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Nie masz konta?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary">
              Utwórz konto
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
