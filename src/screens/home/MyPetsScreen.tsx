import { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PawPrint, Plus, ArrowRight } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getPets, type PetRow } from '../../services/supabase';

export default function MyPetsScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<PetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadPets = async () => {
        setLoading(true);
        setError(null);
        try {
          const nextPets = await getPets();
          if (active) setPets(nextPets);
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load pets.');
        } finally {
          if (active) setLoading(false);
        }
      };

      void loadPets();
      return () => {
        active = false;
      };
    }, []),
  );

  const openScreen = (name: string, params?: object) => {
    navigation.getParent()?.navigate(name, params);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>My Pets</Text>
        <Pressable onPress={() => openScreen('AddPet')} style={{ backgroundColor: '#2ec7a2', width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color="#07141d" />
        </Pressable>
      </View>

      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {!loading && !error && pets.length > 0 ? (
          pets.map((pet) => (
            <Pressable key={pet.id} onPress={() => openScreen('PetProfile', { petId: pet.id })} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#163a45', alignItems: 'center', justifyContent: 'center' }}>
                    <PawPrint size={18} color="#8ae0c5" />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ color: '#f4fbff', fontWeight: '800', fontSize: 18 }}>{pet.name}</Text>
                    <Text style={{ color: '#9cb6c7', fontSize: 12 }}>{pet.species || 'Pet'} · {pet.age || 'Age not provided'}</Text>
                  </View>
                </View>
                <ArrowRight size={18} color="#8ae0c5" />
              </View>
              {pet.breed ? <Text style={{ color: '#9cb6c7', marginTop: 14 }}>{pet.breed}</Text> : null}
            </Pressable>
          ))
        ) : null}
        {!loading && !error && pets.length === 0 ? (
          <Text style={{ color: '#9cb6c7', marginTop: 12 }}>No pets found in your account.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
