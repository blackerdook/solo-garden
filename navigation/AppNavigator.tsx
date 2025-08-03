// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import Home from '../screens/Home';
import Plants from '../screens/Plants';
import Camera from '../screens/Camera';
import Profile from '../screens/Profile';
import Remedy from '../screens/Remedy';
import UserW from '../screens/UserW'; 

export type RootStackParamList = {
  Home: undefined;
  Plants: undefined;
  Camera: undefined;
  Profile: undefined;
  Remedy: undefined;
  UserW: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">

       <Tab.Screen name="Home" component={Home} 
       options= {{tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} />
      )}}/>

      <Tab.Screen name="Plants" component={Plants}
      options= {{tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? 'leaf' : 'leaf'} size={24} color={color} />
      )}}/>

      <Tab.Screen name="Camera" component={Camera}
      options= {{tabBarIcon: ({color, focused}) => (
        <Ionicons name={focused ? 'camera-sharp' : 'camera-outline'} size={24} color={color} /> 
      )}}/>

      <Tab.Screen name="Remedy" component={Remedy}
      options= {{tabBarIcon: ({color, focused}) => (
        <Ionicons name={focused ? 'medkit-sharp' : 'medkit-outline'} size={24} color={color} />
      )}}/>

      <Tab.Screen name="Profile" component={Profile}
      options= {{tabBarIcon: ({color, focused}) => (
        <Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={24} color={color} />
      )}}/>
        
      

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
