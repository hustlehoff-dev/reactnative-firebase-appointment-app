import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { useState } from "react";
import { icons } from "../constants";
type FormFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: any) => void;
  otherStyles: string;
  keyboardType: string;
};

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium ">{title}</Text>
      <View className="w-full h-16 px-4 bg-zinc-800 mt-2 rounded-2xl border-2 border-gray-800 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-10 h-10"
              resizeMode="contain"></Image>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
