import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { resetPassword } from '../../services/supabase';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter the email address for your account.');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Reset failed', error.message || 'Unable to send a reset email.');
      return;
    }

    Alert.alert('Check your inbox', 'A password reset link has been sent.');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 24 }}>
      <Text style={{ color: '#f4fbff', fontSize: 30, fontWeight: '800', marginTop: 20 }}>Reset password</Text>
      <Text style={{ color: '#9cb6c7', marginTop: 8, lineHeight: 22 }}>Enter the email connected to your Petziq account and we’ll send a reset link.</Text>

      <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Email address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#7a90a3"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }}
        />
      </View>

      <Pressable onPress={handleReset} disabled={loading} style={{ marginTop: 24, backgroundColor: loading ? '#4c7d6a' : '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>{loading ? 'Sending...' : 'Send reset link'}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')} style={{ marginTop: 24, alignItems: 'center' }}>
        <Text style={{ color: '#8ae0c5', fontWeight: '700' }}>Back to login</Text>
      </Pressable>
    </SafeAreaView>
  );
}
