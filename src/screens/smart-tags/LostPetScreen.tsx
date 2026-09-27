import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LostPetScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Lost Pet</Text>
      <Text style={{ color: '#9cb6c7', marginBottom: 20, lineHeight: 22 }}>Report a missing pet and make their tag easier to identify with a public QR profile.</Text>

      <TextInput placeholder="Pet name" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff', marginBottom: 14 }} />
      <TextInput placeholder="Last seen location" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff', marginBottom: 14 }} />
      <TextInput placeholder="Contact details" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff', marginBottom: 20 }} />

      <Pressable style={{ backgroundColor: '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>Report lost pet</Text>
      </Pressable>
    </SafeAreaView>
  );
}
