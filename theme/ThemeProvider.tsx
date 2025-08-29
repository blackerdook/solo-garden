// theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeName = 'light' | 'dark';

type Colors = {
  ACCENT: string;
  BG: string;
  CARD: string;
  INK: string;
  MUTED: string;
  BORDER: string;
  // extras if you want
};

const light: Colors = {
  ACCENT: '#2a7c4f',
  BG: '#F6F8F7',
  CARD: '#FFFFFF',
  INK: '#0F1A14',
  MUTED: '#6F7B74',
  BORDER: '#E5ECE8',
};

const dark: Colors = {
  ACCENT: '#2a7c4f',
  BG: '#0E0F0E',
  CARD: '#161A17',
  INK: '#E6EEE9',
  MUTED: '#9BA6A0',
  BORDER: '#2A2F2C',
};

const THEME_KEY = 'appTheme';

const ThemeCtx = createContext<{
  theme: ThemeName;
  colors: Colors;
  setTheme: (t: ThemeName) => void;
}>({ theme: 'light', colors: light, setTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('light');

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(THEME_KEY)) as ThemeName | null;
      if (saved) {
        setTheme(saved);
      } else {
        const sys = Appearance.getColorScheme();
        setTheme(sys === 'dark' ? 'dark' : 'light');
      }
    })();
  }, []);

  const setAndSave = async (t: ThemeName) => {
    setTheme(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  };

  const colors = useMemo(() => (theme === 'dark' ? dark : light), [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, colors, setTheme: setAndSave }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeCtx);
