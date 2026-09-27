import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RemindersScreen() {
  const reminders = [
    { title: 'Milo walk', time: '7:00 AM', status: 'Due today' },
    { title: 'Luna feeding', time: '6:30 PM', status: 'Scheduled' },
    { title: 'Vitamin check', time: 'Thursday', status: 'Upcoming' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Reminders</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {reminders.map((item) => (
          <View key={item.title} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
              <Text style={{ color: '#8ae0c5', fontSize: 11, fontWeight: '700' }}>{item.status}</Text>
            </View>
            <Text style={{ color: '#9cb6c7', marginTop: 8 }}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
