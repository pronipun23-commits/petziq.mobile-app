import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Pet Profile</Text>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <View style={{ backgroundColor: '#102a39', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#f4fbff', fontSize: 24, fontWeight: '800' }}>Milo</Text>
          <Text style={{ color: '#9cb6c7', marginTop: 4 }}>Mini Aussie • 2 years old</Text>
        </View>

        <View style={{ backgroundColor: '#102a39', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#edf8ff', fontWeight: '700', marginBottom: 12 }}>Health summary</Text>
          <Text style={{ color: '#9cb6c7', lineHeight: 22 }}>Excellent condition. Energy, appetite, and movement have remained consistent over the last week.</Text>
        </View>

        <View style={{ backgroundColor: '#102a39', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#edf8ff', fontWeight: '700', marginBottom: 12 }}>Care notes</Text>
          <Text style={{ color: '#9cb6c7', lineHeight: 22 }}>Needs daily walk, hydration check, and a bedtime routine with a chew toy.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
