
import { supabase } from '../services/supabase';

export const signInWithPassword = async ({ email, password }: SignInWithPassword) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithPassword = async ({ email, password }: SignUpWithPassword) => {
    return await supabase.auth.signUp({
        email,
        password,
    });
};

export const getSession = async () => {
    return await supabase.auth.getSession();
};
