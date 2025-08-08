// navigation/AppNavigator.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Home from '../screens/Home';
import Plants from '../screens/Plants';
import Camera from '../screens/Camera';
import Remedy from '../screens/Remedy';
import Profile from '../screens/Profile';

import PlantStack from './PlantStack';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const handleMenuToggle = () => {
    setShowMenu((prev) => !prev);
  };

  const handleMenuAction = (screenName: string) => {
    setShowMenu(false);
    navigation.navigate(screenName as never);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
       <Tab.Screen
          name="Plants"
          component={PlantStack} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="leaf" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={Camera}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="camera" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Remedy"
          component={Remedy}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="medkit" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default AppNavigator;
