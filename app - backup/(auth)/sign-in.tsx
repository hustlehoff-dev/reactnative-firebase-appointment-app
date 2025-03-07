import { View, Text, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { images } from "../../constants";
import FormField from "../../components/formfield";
import CustomButton from "../../components/custombutton";
import { Link } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const submit = () => {};
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
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-adress"
            placeholder=""
          />
          <FormField
            title="Hasło"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="password"
            placeholder=""
          />

          <CustomButton
            title="Zaloguj"
            handlePress={submit}
            containerStyles=" mt-7"
            isLoading={isSubmit}
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
