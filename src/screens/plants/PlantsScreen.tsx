import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPlantFavorites, type PlantFavoriteRow } from '../../services/supabase';

export default function PlantsScreen() {
  const [plants, setPlants] = useState<PlantFavoriteRow[]>([]);

  useEffect(() => {
    const loadPlants = async () => {
      const nextPlants = await getPlantFavorites();
      setPlants(nextPlants);
    };

    void loadPlants();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Plants</Text>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {plants.length > 0 ? (
          plants.map((plant) => (
            <View key={plant.id} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
              <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 18 }}>{plant.plant_id}</Text>
              <Text style={{ color: '#8ae0c5', marginTop: 8, fontWeight: '700' }}>Saved in Supabase</Text>
              <Text style={{ color: '#9cb6c7', marginTop: 6 }}>Synced with your Petziq backend.</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#9cb6c7' }}>No plant favorites found in the backend yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
