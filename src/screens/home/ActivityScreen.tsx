import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  const activity = [
    { title: 'Walk completed', detail: 'Milo • 2.4 km', time: 'Today, 7:15 AM' },
    { title: 'Water refill', detail: 'Luna • 1.2 L', time: 'Yesterday, 8:00 PM' },
    { title: 'Vet appointment', detail: 'Reminder confirmed', time: 'Monday, 10:00 AM' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Activity</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {activity.map((item) => (
          <View key={item.title} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{item.detail}</Text>
            <Text style={{ color: '#8ae0c5', marginTop: 10, fontSize: 12 }}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
