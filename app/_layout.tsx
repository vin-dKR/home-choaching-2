import "../global.css"
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { getProfile, getSession } from '../actions/auth';
import LoadingScreen from '../components/Loading';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from "@/services/supabase";

const queryClient = new QueryClient();

function RootLayoutNav() {

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        });

        return () => subscription.unsubscribe();
    }, [queryClient]);

    const { data: sessionData, isLoading: sessionDataLoading } = useQuery({
        queryKey: ['session'],
        queryFn: getSession
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', sessionData?.session?.user.id],
        queryFn: getProfile,
        enabled: !!sessionData?.session?.user.id,
    });

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {

        if (sessionDataLoading || profileLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        const session = sessionData?.session;

        if (!session && !inAuthGroup) {
            router.replace('/auth/login');
        } else if (session) {

            const onboarded = profileData?.onboarded;
            const role = profileData?.role;

            const isOnboardingFlow =
                (segments[0] === 'auth' && segments[1] === 'select-role') ||
                (segments[0] === 'student' && segments[1] === 'onboarding') ||
                (segments[0] === 'teacher' && segments[1] === 'onboarding');

            if (inAuthGroup && onboarded) {
                const targetDashboard = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
                router.replace(targetDashboard);
            }
            else if (!onboarded && !isOnboardingFlow && !inAuthGroup) {
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
