import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantsScreen() {
  const plants = [
    { name: 'Monstera', status: 'Thriving', next: 'Water in 2 days' },
    { name: 'Aloe Vera', status: 'Healthy', next: 'Water in 5 days' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Plants</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {plants.map((plant) => (
          <View key={plant.name} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 18 }}>{plant.name}</Text>
            <Text style={{ color: '#8ae0c5', marginTop: 8, fontWeight: '700' }}>{plant.status}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{plant.next}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
