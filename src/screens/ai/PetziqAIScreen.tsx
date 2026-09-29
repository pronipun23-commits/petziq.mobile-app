import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, SendHorizontal } from 'lucide-react-native';
import { askPetziqAI, getPets, getUserPlants } from '../../services/supabase';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function PetziqAIScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || sending) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    setError(null);
    try {
      const [pets, plants] = await Promise.all([getPets(), getUserPlants()]);
      const reply = await askPetziqAI(nextMessages, pets, plants);
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not reach Petziq AI.');
    } finally {
      setSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d' }}>
      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#123744', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="#8ae0c5" />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ color: '#f6fbff', fontSize: 20, fontWeight: '800' }}>Petziq AI</Text>
          <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Pet care assistant</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, flexGrow: 1, gap: 12 }} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Bot size={30} color="#8ae0c5" />
            <Text style={{ color: '#edf8ff', fontWeight: '700', marginTop: 12, textAlign: 'center' }}>Ask about pet or plant care</Text>
          </View>
        ) : messages.map((message, index) => (
          <View key={`${message.role}-${index}`} style={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', backgroundColor: message.role === 'user' ? '#164b43' : '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#edf8ff', lineHeight: 22 }}>{message.content}</Text>
          </View>
        ))}
        {sending ? <ActivityIndicator color="#8ae0c5" style={{ alignSelf: 'flex-start', marginVertical: 8 }} /> : null}
        {error ? <Text style={{ color: '#ff8a8a' }}>{error}</Text> : null}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 18, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#112b39', borderRadius: 14, borderWidth: 1, borderColor: '#1c3b48', paddingHorizontal: 12 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => void sendMessage()}
            editable={!sending}
            returnKeyType="send"
            placeholder="Ask a care question"
            placeholderTextColor="#89a1b2"
            style={{ flex: 1, color: '#edf8ff', paddingVertical: 14 }}
          />
          <Pressable onPress={() => void sendMessage()} disabled={sending || !input.trim()} accessibilityLabel="Send question" style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: '#2ec7a2', alignItems: 'center', justifyContent: 'center', opacity: sending || !input.trim() ? 0.5 : 1 }}>
            <SendHorizontal size={18} color="#061d1d" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
