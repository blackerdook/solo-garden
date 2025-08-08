import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import UserW from './screens/UserW';

export default function App() {
  const [showGuide, setShowGuide] = useState(true); 

  return (
    <NavigationContainer>
      {showGuide ? (
        <UserW onSkip={() => setShowGuide(false)} />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}
