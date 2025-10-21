
import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { getSession } from '../actions/auth';
import LoadingScreen from '../components/Loading';
import { useColorScheme } from '@/hooks/use-color-scheme';

const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)/login',
};

function RootLayoutNav() {
  const { data: session, isLoading } = useQuery({ 
    queryKey: ['session'], 
    queryFn: getSession 
  });

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    // If the user is not signed in and the initial segment is not in the auth group.
    if (!session?.data.session && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/auth/login');
    } else if (session?.data.session && inAuthGroup) {
      // Redirect away from the auth page.
      // We will redirect to the student dashboard as a default.
      router.replace('/student/dashboard');
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <Stack>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="student/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="teacher/dashboard" options={{ headerShown: false }} />
      </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
