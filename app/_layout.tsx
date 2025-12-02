import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { getProfile, getSession } from '../actions/auth';
import LoadingScreen from '../components/Loading';
import { useColorScheme } from '@/hooks/use-color-scheme';

const queryClient = new QueryClient();

function RootLayoutNav() {
    console.log("000 RENDER RootLayoutNav");

    const { data: sessionData, isLoading: sessionDataLoading } = useQuery({
        queryKey: ['session'],
        queryFn: getSession
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', sessionData?.session?.user.id],
        queryFn: getProfile,
        enabled: !!sessionData?.session?.user.id,
    });

    console.log("000 sessionData:", sessionData);
    console.log("000 profileData:", profileData);
    console.log("000 sessionLoading:", sessionDataLoading);
    console.log("000 profileLoading:", profileLoading);

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log("000 USEEFFECT RUNNING");

        if (sessionDataLoading || profileLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        const session = sessionData?.session;

        console.log("000 Auth Group:", inAuthGroup);
        console.log("000 Session:", session);

        if (!session && !inAuthGroup) {
            console.log("000 REDIRECT → /auth/login");
            router.replace('/auth/login');
        } else if (session) {
            console.log("000 USER LOGGED IN");

            const onboarded = profileData?.onboarded;
            const role = profileData?.role;

            const isOnboardingFlow =
                (segments[0] === 'auth' && segments[1] === 'select-role') ||
                (segments[0] === 'student' && segments[1] === 'onboarding') ||
                (segments[0] === 'teacher' && segments[1] === 'onboarding');

            console.log("000 onboarded:", onboarded);
            console.log("000 role:", role);
            console.log("000 isOnboardingFlow:", isOnboardingFlow);

            if (inAuthGroup && onboarded) {
                const targetDashboard = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
                console.log("000 REDIRECT →", targetDashboard);
                router.replace(targetDashboard);
            }
            else if (!onboarded && !isOnboardingFlow && !inAuthGroup) {
                console.log("000 REDIRECT → /auth/select-role");
                router.replace('/auth/select-role');
            }
        }
    }, [sessionData, profileData, profileLoading, sessionDataLoading, segments, router]);

    if (sessionDataLoading || profileLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack>
            <Stack.Screen name="auth/login" options={{ title: "Start signup or signin" }} />
            <Stack.Screen name="auth/verify-otp" options={{ title: 'Verify Code' }} />
            <Stack.Screen name="auth/select-role" options={{ title: 'Select Your Role' }} />
            <Stack.Screen name="student/onboarding" options={{ title: 'Student Profile' }} />
            <Stack.Screen name="teacher/onboarding" options={{ title: 'Teacher Profile' }} />
            <Stack.Screen name="student/dashboard" options={{ headerShown: true }} />
            <Stack.Screen name="teacher/dashboard" options={{ headerShown: true }} />
        </Stack>

    )
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
