import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 24 }}>
      <Text style={{ color: '#f4fbff', fontSize: 30, fontWeight: '800', marginTop: 20 }}>Create account</Text>
      <Text style={{ color: '#9cb6c7', marginTop: 8 }}>Join Petziq to manage care, tags, and reminders.</Text>

      <View style={{ marginTop: 28, gap: 16 }}>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Full name</Text>
          <TextInput style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} placeholder="Jane Pet Parent" placeholderTextColor="#7a90a3" />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Email</Text>
          <TextInput style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} placeholder="you@example.com" placeholderTextColor="#7a90a3" keyboardType="email-address" />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Password</Text>
          <TextInput style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} placeholder="Create password" placeholderTextColor="#7a90a3" secureTextEntry />
        </View>

        <Pressable onPress={() => navigation.navigate('Main')} style={{ backgroundColor: '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>Register</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9cb6c7' }}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#8ae0c5', fontWeight: '700' }}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
