
import React from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../../services/supabase';

const StudentDashboard: React.FC = () => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // The root layout will handle redirecting to the login screen.
    };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Student Dashboard</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default StudentDashboard;
