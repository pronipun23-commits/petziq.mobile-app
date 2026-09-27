import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddPetScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 20 }}>Add Pet</Text>

      <View style={{ gap: 16 }}>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Pet name</Text>
          <TextInput placeholder="Buddy" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Type</Text>
          <TextInput placeholder="Dog" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Breed</Text>
          <TextInput placeholder="Golden Retriever" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
      </View>

      <Pressable style={{ marginTop: 28, backgroundColor: '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>Save pet</Text>
      </Pressable>
    </SafeAreaView>
  );
}
