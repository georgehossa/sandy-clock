import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/lib/i18n'; // initialize i18n early

SplashScreen.preventAutoHideAsync();

// expo-notifications local scheduling is not supported in Expo Go (SDK 53+).
// All notification setup is skipped when running inside Expo Go so the app
// remains usable during development without a full dev build.
const IS_EXPO_GO = Constants.appOwnership === 'expo';

if (!IS_EXPO_GO) {
  // Lazy require keeps the import from throwing at module evaluation time
  // inside Expo Go, where the native module is stripped.
  const Notifications =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-notifications') as typeof import('expo-notifications');

  // Suppress notification display when the app is in the foreground — the
  // in-app confetti + tone experience is the primary completion signal.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });

  // Set up the Android notification channel once at app start.
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('finish', {
      name: 'Timer finished',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#A8D5C8',
    });
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F0EB' },
        }}
      />
    </SafeAreaProvider>
  );
}
