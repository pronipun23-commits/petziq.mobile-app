import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivateTagScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Activate Tag</Text>
      <Text style={{ color: '#9cb6c7', marginBottom: 20, lineHeight: 22 }}>Enter your smart tag ID to link it to your pet profile and enable real-time care updates.</Text>

      <TextInput
        placeholder="PET-001"
        placeholderTextColor="#7a90a3"
        style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }}
      />

      <Pressable style={{ marginTop: 24, backgroundColor: '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>Activate</Text>
      </Pressable>
    </SafeAreaView>
  );
}
