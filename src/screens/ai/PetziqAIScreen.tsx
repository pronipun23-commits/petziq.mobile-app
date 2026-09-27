import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react-native';

export default function PetziqAIScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d' }}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#123744', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#8ae0c5" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: '#f6fbff', fontSize: 20, fontWeight: '800' }}>Petziq AI</Text>
            <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Pet care assistant</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#8ae0c5', fontWeight: '700', marginBottom: 8 }}>Recommended routine</Text>
          <Text style={{ color: '#edf8ff', lineHeight: 22 }}>For Milo, a short walk and hydration check in the morning plus a feeding reminder later in the evening would keep the routine consistent.</Text>
        </View>

        <View style={{ marginTop: 20, gap: 10 }}>
          {['How often should I walk Milo?', 'What should Luna eat today?', 'Any signs I should call a vet?'].map((item) => (
            <Pressable key={item} style={{ backgroundColor: '#102a39', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#1d3a48' }}>
              <Text style={{ color: '#edf8ff' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#112b39', borderRadius: 16, borderWidth: 1, borderColor: '#1c3b48', paddingHorizontal: 12 }}>
          <TextInput placeholder="Ask Petziq AI..." placeholderTextColor="#89a1b2" style={{ flex: 1, color: '#edf8ff', paddingVertical: 14 }} />
          <Pressable style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#2ec7a2', alignItems: 'center', justifyContent: 'center' }}>
            <SendHorizonal size={18} color="#061d1d" />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Sparkles size={14} color="#8ae0c5" />
          <Text style={{ color: '#9cb6c7', marginLeft: 6, fontSize: 12 }}>AI-generated advice for general pet care</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
