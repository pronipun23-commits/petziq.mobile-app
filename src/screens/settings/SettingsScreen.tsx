import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock, ShieldCheck, ChevronRight, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const rows = [
    { label: 'Notifications', icon: Bell },
    { label: 'Privacy', icon: Lock },
    { label: 'Security', icon: ShieldCheck },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Settings</Text>

      <View style={{ gap: 12 }}>
        {rows.map(({ label, icon: Icon }) => (
          <Pressable key={label} style={{ backgroundColor: '#102a39', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#163a45', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color="#8ae0c5" />
            </View>
            <Text style={{ color: '#edf8ff', fontWeight: '700', marginLeft: 12, flex: 1 }}>{label}</Text>
            <ChevronRight size={18} color="#9cb6c7" />
          </Pressable>
        ))}
      </View>

      <Pressable style={{ marginTop: 28, backgroundColor: '#122e37', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <LogOut size={18} color="#fda4af" />
        <Text style={{ color: '#fda4af', fontWeight: '800', marginLeft: 8 }}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
