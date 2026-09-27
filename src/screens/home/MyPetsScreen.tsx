import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PawPrint, Plus, ArrowRight } from 'lucide-react-native';

export default function MyPetsScreen() {
  const pets = [
    { name: 'Milo', type: 'Dog', health: 'Excellent', age: '2 years' },
    { name: 'Luna', type: 'Cat', health: 'Stable', age: '4 years' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>My Pets</Text>
        <Pressable style={{ backgroundColor: '#2ec7a2', width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color="#07141d" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {pets.map((pet) => (
          <Pressable key={pet.name} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#163a45', alignItems: 'center', justifyContent: 'center' }}>
                  <PawPrint size={18} color="#8ae0c5" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: '#f4fbff', fontWeight: '800', fontSize: 18 }}>{pet.name}</Text>
                  <Text style={{ color: '#9cb6c7', fontSize: 12 }}>{pet.type} • {pet.age}</Text>
                </View>
              </View>
              <ArrowRight size={18} color="#8ae0c5" />
            </View>

            <View style={{ marginTop: 14, backgroundColor: '#0d2130', borderRadius: 12, padding: 10 }}>
              <Text style={{ color: '#baf7df', fontWeight: '700' }}>{pet.health}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
