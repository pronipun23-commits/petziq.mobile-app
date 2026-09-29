import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { getCurrentUser, getProfile, signOut, type ProfileRow } from '../../services/supabase';

export default function SettingsScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.all([getCurrentUser(), getProfile()]).then(([{ user, error: userError }, nextProfile]) => {
      if (!active) return;
      if (userError) setError(userError.message);
      setEmail(user?.email ?? null);
      setProfile(nextProfile);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your account.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      const signOutError = await signOut();
      if (signOutError) setError(signOutError.message);
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Could not sign out.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Account</Text>
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      {profile ? (
        <View style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#f4fbff', fontSize: 18, fontWeight: '800' }}>{profile.full_name}</Text>
          <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{profile.pet_name}</Text>
          {email ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{email}</Text> : null}
        </View>
      ) : null}
      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}
      <Pressable onPress={() => void handleSignOut()} disabled={signingOut} style={{ marginTop: 28, backgroundColor: '#122e37', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: signingOut ? 0.6 : 1 }}>
        <LogOut size={18} color="#fda4af" />
        <Text style={{ color: '#fda4af', fontWeight: '800', marginLeft: 8 }}>{signingOut ? 'Logging out...' : 'Log out'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
