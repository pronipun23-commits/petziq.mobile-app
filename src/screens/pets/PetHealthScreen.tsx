import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetHealthScreen() {
  const healthMetrics = [
    { label: 'Weight', value: '24.5 kg' },
    { label: 'Hydration', value: 'Normal' },
    { label: 'Activity', value: 'High' },
    { label: 'Mood', value: 'Happy' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Pet Health</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {healthMetrics.map((item) => (
          <View key={item.label} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#9cb6c7' }}>{item.label}</Text>
            <Text style={{ color: '#f4fbff', fontWeight: '700' }}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
