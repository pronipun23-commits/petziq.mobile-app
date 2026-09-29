import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { activateSmartTag, getPets, getSmartTagByTagId, getUserPlants, type PetRow, type SmartTagRow, type UserPlantRow } from '../../services/supabase';

export default function ActivateTagScreen() {
  const navigation = useNavigation<any>();
  const [tagId, setTagId] = useState('');
  const [tag, setTag] = useState<SmartTagRow | null>(null);
  const [pets, setPets] = useState<PetRow[]>([]);
  const [plants, setPlants] = useState<UserPlantRow[]>([]);
  const [entityId, setEntityId] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [finding, setFinding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getPets(), getUserPlants()]).then(([nextPets, nextPlants]) => {
      if (!active) return;
      setPets(nextPets);
      setPlants(nextPlants);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load pets and plants.');
    }).finally(() => {
      if (active) setLoadingOptions(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const findTag = async () => {
    if (!tagId.trim()) {
      setError('Enter a Smart Tag ID.');
      return;
    }
    setFinding(true);
    setError(null);
    setTag(null);
    setEntityId('');
    try {
      const foundTag = await getSmartTagByTagId(tagId.trim());
      if (!foundTag) {
        setError('No Smart Tag with that ID was found in your account.');
      } else {
        setTag(foundTag);
        setEntityId(foundTag.tag_type === 'plant' ? foundTag.plant_id ?? '' : foundTag.pet_id ?? '');
      }
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'Could not find this Smart Tag.');
    } finally {
      setFinding(false);
    }
  };

  const activate = async () => {
    if (!tag || !entityId) {
      setError('Find a tag and select the pet or plant it belongs to.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { error: activationError } = await activateSmartTag(tag, entityId);
      if (activationError) {
        setError(activationError.message);
        return;
      }
      navigation.goBack();
    } catch (activationError) {
      setError(activationError instanceof Error ? activationError.message : 'Could not activate this tag.');
    } finally {
      setSaving(false);
    }
  };

  const linkedEntities = tag?.tag_type === 'plant' ? plants : pets;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <ArrowLeft size={20} color="#edf8ff" />
        </Pressable>
        <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>Activate Tag</Text>
      </View>
      <Text style={{ color: '#9cb6c7', marginBottom: 20, lineHeight: 22 }}>Find a registered tag, then link it with one of your saved records.</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput value={tagId} onChangeText={(value) => { setTagId(value); setTag(null); setEntityId(''); }} placeholder="Smart Tag ID" autoCapitalize="characters" placeholderTextColor="#7a90a3" style={{ flex: 1, backgroundColor: '#102a39', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#21475a', color: '#edf8ff' }} />
        <Pressable onPress={() => void findTag()} disabled={finding} style={{ paddingHorizontal: 14, justifyContent: 'center', backgroundColor: '#163a45', borderRadius: 12 }}>
          {finding ? <ActivityIndicator color="#8ae0c5" /> : <Text style={{ color: '#edf8ff', fontWeight: '700' }}>Find tag</Text>}
        </Pressable>
      </View>

      {tag ? <Text style={{ color: '#8ae0c5', fontWeight: '700', marginTop: 20 }}>This tag is for a {tag.tag_type}.</Text> : null}
      {loadingOptions ? <ActivityIndicator color="#8ae0c5" style={{ marginTop: 20 }} /> : null}
      <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 12 }}>
        {tag ? linkedEntities.map((entity) => (
          <Pressable key={entity.id} onPress={() => setEntityId(entity.id)} style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: entityId === entity.id ? '#2ec7a2' : '#1d3a48', backgroundColor: '#102a39' }}>
            <Text style={{ color: '#edf8ff', fontWeight: '700' }}>{entity.name}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 4 }}>{tag.tag_type === 'plant' ? (entity as UserPlantRow).species : (entity as PetRow).species}</Text>
          </Pressable>
        )) : null}
      </ScrollView>
      {tag && !loadingOptions && linkedEntities.length === 0 ? <Text style={{ color: '#9cb6c7', marginTop: 12 }}>No saved {tag.tag_type} records are available to link.</Text> : null}
      {error ? <Text style={{ color: '#ff8a8a', marginTop: 12 }}>{error}</Text> : null}
      <Pressable onPress={() => void activate()} disabled={saving || finding || !tag || loadingOptions || linkedEntities.length === 0} style={{ marginTop: 16, backgroundColor: '#2ec7a2', borderRadius: 12, paddingVertical: 15, alignItems: 'center', opacity: saving || !tag || loadingOptions ? 0.6 : 1 }}>
        <Text style={{ color: '#07141d', fontWeight: '800' }}>{saving ? 'Activating...' : 'Activate tag'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
