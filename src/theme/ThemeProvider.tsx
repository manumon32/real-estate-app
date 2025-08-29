// theme/ThemeProvider.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import {lightTheme, darkTheme} from './index';

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
