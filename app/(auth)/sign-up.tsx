import { View, Text, Image, TextInput, Alert } from "react-native";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { images } from "../../constants";
import FormField from "../../components/formfield";
import CustomButton from "../../components/custombutton";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/home");
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
            title="Utwórz konto"
            handlePress={signUp}
            containerStyles=" mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Masz konto byku?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary">
              Zaloguj się
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
