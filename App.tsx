import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ⬅️ add this
import AppNavigator from './navigation/AppNavigator';
import UserW from './screens/UserW';

export default function App() {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {showGuide ? (
          <UserW onSkip={() => setShowGuide(false)} />
        ) : (
          <AppNavigator />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
