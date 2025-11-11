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
    initialRouteName: 'auth/login',
};

function RootLayoutNav() {
    const { data: sessionData, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: getSession
    });

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        const session = sessionData?.session

        if (!session && !inAuthGroup) {
            router.replace('/auth/login');
        } else if (session) {
            const onboarded = session.user.user_metadata?.onboarded;
            const role = session.user.user_metadata?.role;

            const isOnboardingFlow =
                (segments[0] === 'auth' && segments[1] === 'select-role') ||
                (segments[0] === 'student' && segments[1] === 'onboarding') ||
                (segments[0] === 'teacher' && segments[1] === 'onboarding');

            if (inAuthGroup && onboarded) {
                const targetDashboard = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
                router.replace(targetDashboard);
            } else if (!onboarded && !isOnboardingFlow && !inAuthGroup) {
                router.replace('/auth/select-role');
            }
        }
    }, [sessionData, isLoading, segments, router]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack>
            <Stack.Screen name="auth/login" options={{ title: "Start signup or signin" }} />
            <Stack.Screen name="auth/verify-otp" options={{ title: 'Verify Code' }} />
            <Stack.Screen name="auth/select-role" options={{ title: 'Select Your Role' }} />
            <Stack.Screen name="student/onboarding" options={{ title: 'Student Profile' }} />
            <Stack.Screen name="teacher/onboarding" options={{ title: 'Teacher Profile' }} />
            <Stack.Screen name="student/dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="teacher/dashboard" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
        {/*
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            </ThemeProvider>
            */}
                <RootLayoutNav />
                <StatusBar style="auto" />
        </QueryClientProvider>
    );
}
