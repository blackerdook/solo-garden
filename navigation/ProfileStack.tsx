import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Journal from '../screens/Journal'; // add

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Journal: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Journal" component={Journal} />
    </Stack.Navigator>
  );
}
