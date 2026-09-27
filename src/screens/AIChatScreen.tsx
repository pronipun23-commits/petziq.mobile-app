import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react-native';
import { useState } from 'react';

const suggestions = ['How often should I walk Milo?', 'What should Luna eat today?', 'Health warning signs?'];

export default function AIChatScreen() {
  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d' }}>
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#123744', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#8ae0c5" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: '#f6fbff', fontSize: 20, fontWeight: '800' }}>Petziq AI</Text>
            <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Always-on care assistant</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#dffcf4', fontWeight: '700', marginBottom: 8 }}>Pet care advice</Text>
          <Text style={{ color: '#edf8ff', lineHeight: 22 }}>Try asking about feeding schedules, symptoms, enrichment, or plant care tips. The AI assistant can summarize patterns and suggest routines.</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#9cb6c7', marginBottom: 12, fontWeight: '600' }}>Suggested prompts</Text>
          <View style={{ gap: 10 }}>
            {suggestions.map((item) => (
              <Pressable key={item} style={{ backgroundColor: '#102a39', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#1d3a48' }}>
                <Text style={{ color: '#edf8ff' }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: '#102a39', borderRadius: 16, padding: 14, marginTop: 28, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#8ae0c5', fontWeight: '700' }}>Assistant</Text>
          <Text style={{ color: '#edf8ff', marginTop: 8, lineHeight: 22 }}>A good routine is a balanced walk, fresh water, and a short check for appetite or skin changes. I can help you refine a plan for your pet.</Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 26, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#112b39', borderRadius: 16, borderWidth: 1, borderColor: '#1c3b48', paddingHorizontal: 12 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Petziq AI..."
            placeholderTextColor="#89a1b2"
            style={{ flex: 1, color: '#edf8ff', paddingVertical: 15 }}
          />
          <Pressable style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#2ec7a2', alignItems: 'center', justifyContent: 'center' }}>
            <SendHorizonal size={18} color="#061d1d" />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Sparkles size={14} color="#8ae0c5" />
          <Text style={{ color: '#9cb6c7', marginLeft: 6, fontSize: 12 }}>AI-generated guidance for general pet care</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
