import { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUserPlants, type UserPlantRow } from '../../services/supabase';

export default function PlantsScreen() {
  const [plants, setPlants] = useState<UserPlantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadPlants = async () => {
        setLoading(true);
        setError(null);
        try {
          const nextPlants = await getUserPlants();
          if (active) setPlants(nextPlants);
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load plants.');
        } finally {
          if (active) setLoading(false);
        }
      };

      void loadPlants();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Plants</Text>
      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {!loading && !error && plants.length > 0 ? (
          plants.map((plant) => (
            <View key={plant.id} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
              <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 18 }}>{plant.name}</Text>
              {plant.species ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{plant.species}</Text> : null}
              {plant.watering_frequency ? <Text style={{ color: '#8ae0c5', marginTop: 10 }}>{plant.watering_frequency}</Text> : null}
              {plant.location ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{plant.location}</Text> : null}
              {plant.notes ? <Text style={{ color: '#9cb6c7', marginTop: 10 }}>{plant.notes}</Text> : null}
            </View>
          ))
        ) : null}
        {!loading && !error && plants.length === 0 ? <Text style={{ color: '#9cb6c7' }}>No plants found in your account.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
