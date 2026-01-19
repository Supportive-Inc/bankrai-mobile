import { Navigation } from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { StatusBar, useColorScheme } from 'react-native';
import { adapty } from 'react-native-adapty';
import './global.css';
import AppStateStore from 'Store/AppStateStore';
import { useEffect } from 'react';

export default function App() {
  const appStore = AppStateStore();
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (appStore.useDeviceColorScheme) {
      appStore.setDarkMode(colorScheme === 'dark' ? true : false);
    }
  }, [appStore.useDeviceColorScheme]);
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          animated={true}
          barStyle={appStore.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={appStore.darkMode ? '#141414' : '#f2f5f3'}
        />
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
