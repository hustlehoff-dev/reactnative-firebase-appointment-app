import { Text, View, ScrollView, Image } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/custombutton";
import { images } from "../constants";

export default function Index() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ minHeight: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logoSmall}
            className="max-w-[150px] w-full h-[150px] mt-20"
            resizeMode="contain"
          />
          <Image
            source={images.logo}
            className="max-w-[300px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Umawiaj wizyty z{" "}
              <Text className="text-secondary">Essa Barber</Text>
            </Text>
          </View>

          <CustomButton
            title="Wbijaj"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7"
            textStyles=""
          />
        </View>

        <StatusBar backgroundColor="#121212" style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}
