import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { createPet } from '../../services/supabase';

export default function AddPetScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePet = async () => {
    if (!name.trim() || !species.trim()) {
      setError('Pet name and species are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { error: saveError } = await createPet({
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim() || null,
        age: age.trim() || null,
        notes: notes.trim() || null,
      });
      if (saveError) {
        setError(saveError.message);
        return;
      }
      navigation.goBack();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this pet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <ArrowLeft size={20} color="#edf8ff" />
        </Pressable>
        <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>Add Pet</Text>
      </View>

      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Pet name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Species</Text>
          <TextInput value={species} onChangeText={setSpecies} placeholder="Species" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Breed</Text>
          <TextInput value={breed} onChangeText={setBreed} placeholder="Breed" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Age</Text>
          <TextInput value={age} onChangeText={setAge} placeholder="Age" placeholderTextColor="#7a90a3" style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
        <View>
          <Text style={{ color: '#9cb6c7', marginBottom: 8 }}>Care notes</Text>
          <TextInput value={notes} onChangeText={setNotes} multiline placeholder="Notes" placeholderTextColor="#7a90a3" style={{ minHeight: 96, textAlignVertical: 'top', backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        </View>
      </ScrollView>

      {error ? <Text style={{ color: '#ff8a8a', marginTop: 12 }}>{error}</Text> : null}
      <Pressable onPress={() => void savePet()} disabled={saving} style={{ marginTop: 20, backgroundColor: '#2ec7a2', borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: saving ? 0.6 : 1 }}>
        <Text style={{ color: '#07141d', fontWeight: '800', fontSize: 16 }}>{saving ? 'Saving...' : 'Save pet'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
