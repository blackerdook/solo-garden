// navigation/AppNavigator.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import SeasonalPlants from "../screens/SeasonalPlants";
import PlantStack from "./PlantStack";
import Camera from "../screens/Camera";
import Remedy from "../screens/Remedy";
import ProfileStack from "./ProfileStack";
import ChatAssistant from "../components/PlantAssistant";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="SeasonalPlants" component={SeasonalPlants} />
    </Stack.Navigator>
  );
}

const AppNavigator = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(120);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardOffset(e.endCoordinates.height + 20); // push above keyboard
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardOffset(120); // reset default
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={focused ? 30 : 24}
                color={focused ? "green" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Plants"
          component={PlantStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "leaf" : "leaf-outline"}
                size={focused ? 30 : 24}
                color={focused ? "green" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={Camera}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                size={focused ? 30 : 24}
                color={focused ? "green" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Remedy"
          component={Remedy}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "medkit" : "medkit-outline"}
                size={focused ? 30 : 24}
                color={focused ? "green" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={focused ? 30 : 24}
                color={focused ? "green" : color}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Floating chat button */}
      <View style={[styles.chatContainer, { bottom: keyboardOffset }]}>
        <ChatAssistant />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    position: "absolute",
    left: 20,
    zIndex: 999,
  },
});

export default AppNavigator;
