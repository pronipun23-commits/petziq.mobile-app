import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { QrCode, ScanLine } from 'lucide-react-native';
import { getPets, getSmartTags, getUserPlants, type PetRow, type SmartTagRow, type UserPlantRow } from '../../services/supabase';

export default function MyTagsScreen() {
  const navigation = useNavigation<any>();
  const [tags, setTags] = useState<SmartTagRow[]>([]);
  const [pets, setPets] = useState<PetRow[]>([]);
  const [plants, setPlants] = useState<UserPlantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadTags = async () => {
        setLoading(true);
        setError(null);
        try {
          const [nextTags, nextPets, nextPlants] = await Promise.all([getSmartTags(), getPets(), getUserPlants()]);
          if (!active) return;
          setTags(nextTags);
          setPets(nextPets);
          setPlants(nextPlants);
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load Smart Tags.');
        } finally {
          if (active) setLoading(false);
        }
      };
      void loadTags();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>My Tags</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <Pressable onPress={() => navigation.getParent()?.navigate('ActivateTag')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: '#2ec7a2', borderRadius: 12 }}>
          <QrCode size={17} color="#07141d" />
          <Text style={{ color: '#07141d', fontWeight: '800' }}>Activate</Text>
        </Pressable>
        <Pressable onPress={() => navigation.getParent()?.navigate('QRScanner')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: '#102a39', borderRadius: 12, borderWidth: 1, borderColor: '#1d3a48' }}>
          <ScanLine size={17} color="#8ae0c5" />
          <Text style={{ color: '#edf8ff', fontWeight: '700' }}>Scan QR</Text>
        </Pressable>
      </View>
      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {!loading && !error && tags.length > 0 ? tags.map((tag) => {
          const linkedPet = pets.find((pet) => pet.id === tag.pet_id);
          const linkedPlant = plants.find((plant) => plant.id === tag.plant_id);
          return (
            <View key={tag.id} style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
              <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 18 }}>{tag.name || tag.tag_id}</Text>
              <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{tag.tag_id} · {tag.tag_type}</Text>
              <Text style={{ color: '#8ae0c5', marginTop: 10, fontWeight: '700' }}>{tag.status}</Text>
              {linkedPet ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>Linked to {linkedPet.name}</Text> : null}
              {linkedPlant ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>Linked to {linkedPlant.name}</Text> : null}
            </View>
          );
        }) : null}
        {!loading && !error && tags.length === 0 ? <Text style={{ color: '#9cb6c7' }}>No Smart Tags found in your account.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
