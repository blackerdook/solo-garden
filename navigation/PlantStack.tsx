import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlantsScreen from '../screens/Plants';
import PlantDetail from '../screens/PlantDetailsScreen';

export type PlantStackParamList = {
  PlantsScreen: undefined;
  PlantDetail: { plantId: number };
};

const Stack = createNativeStackNavigator<PlantStackParamList>();

const PlantStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlantsScreen" component={PlantsScreen} options={{ title: 'Plants' }} />
      <Stack.Screen name="PlantDetail" component={PlantDetail} options={{ title: 'Plant Details' }} />
    </Stack.Navigator>
  );
};

export default PlantStack;
