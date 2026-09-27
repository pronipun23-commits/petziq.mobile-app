import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyTagsScreen() {
  const tags = [
    { id: 'PET-001', name: 'Milo Tag', status: 'Connected' },
    { id: 'PET-002', name: 'Luna Tag', status: 'Needs sync' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>My Tags</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {tags.map((tag) => (
          <View key={tag.id} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 18 }}>{tag.name}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{tag.id}</Text>
            <Text style={{ color: '#8ae0c5', marginTop: 10, fontWeight: '700' }}>{tag.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
