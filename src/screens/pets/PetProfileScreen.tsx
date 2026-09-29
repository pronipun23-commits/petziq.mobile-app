import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { getActivities, getPet, type ActivityRow, type PetRow } from '../../services/supabase';

export default function PetProfileScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const petId = route.params?.petId as string | undefined;
  const [pet, setPet] = useState<PetRow | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!petId) {
        setError('Pet profile is missing its record ID.');
        setLoading(false);
        return;
      }
      try {
        const [nextPet, allActivities] = await Promise.all([getPet(petId), getActivities()]);
        if (!active) return;
        setPet(nextPet);
        setActivities(allActivities.filter((activity) => activity.pet_id === petId));
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this pet.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, [petId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <ArrowLeft size={20} color="#edf8ff" />
      </Pressable>
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      {error ? <Text style={{ color: '#ff8a8a' }}>{error}</Text> : null}
      {!loading && !error && pet ? (
        <ScrollView contentContainerStyle={{ gap: 16 }}>
          <View style={{ backgroundColor: '#102a39', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#f4fbff', fontSize: 26, fontWeight: '800' }}>{pet.name}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{[pet.species, pet.breed].filter(Boolean).join(' · ')}</Text>
            {pet.age || pet.birth_date ? <Text style={{ color: '#9cb6c7', marginTop: 4 }}>{pet.age || pet.birth_date}</Text> : null}
            {pet.notes ? <Text style={{ color: '#edf8ff', marginTop: 16, lineHeight: 22 }}>{pet.notes}</Text> : null}
          </View>

          <Pressable onPress={() => navigation.navigate('PetHealth', { petId: pet.id })} style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#edf8ff', fontWeight: '700' }}>Care and health records</Text>
            <ArrowRight size={18} color="#8ae0c5" />
          </Pressable>

          <View style={{ gap: 10 }}>
            <Text style={{ color: '#edf8ff', fontWeight: '700', fontSize: 18 }}>Recorded activity</Text>
            {activities.length ? activities.map((activity) => (
              <View key={activity.id} style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1d3a48' }}>
                <Text style={{ color: '#f4fbff', fontWeight: '700' }}>{activity.activity_type}</Text>
                <Text style={{ color: '#9cb6c7', marginTop: 5 }}>{activity.duration_minutes ?? 0} min · {activity.activity_date || activity.created_at || ''}</Text>
                {activity.notes ? <Text style={{ color: '#9cb6c7', marginTop: 5 }}>{activity.notes}</Text> : null}
              </View>
            )) : <Text style={{ color: '#9cb6c7' }}>No activity records for this pet.</Text>}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
