import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmail } from '../../services/supabase';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message || 'Unable to sign in.');
      return;
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 24 }}>
      <Text style={{ color: '#f4fbff', fontSize: 30, fontWeight: '800', marginTop: 24 }}>Petziq</Text>
      <Text style={{ color: '#8ae0c5', fontSize: 15, fontWeight: '700', marginTop: 12 }}>Welcome back</Text>

      <View style={{ marginTop: 36, gap: 16 }}>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#7a90a3"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: '#102a39', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }}
          />
        </View>

        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#7a90a3"
            secureTextEntry
            style={{ backgroundColor: '#102a39', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }}
          />
        </View>

        <Pressable onPress={handleLogin} disabled={loading} style={{ backgroundColor: loading ? '#4c7d6a' : '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>{loading ? 'Signing in...' : 'Log in'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: '#8ae0c5', textAlign: 'center', fontWeight: '600' }}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9cb6c7' }}>New here? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#8ae0c5', fontWeight: '700' }}>Create account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
