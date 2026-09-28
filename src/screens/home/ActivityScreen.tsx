import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createActivity, deleteActivity, getActivities, getPets, updateActivity, type ActivityRow, type PetRow } from '../../services/supabase';

const formatActivityDate = (value?: string | null) => {
  if (!value) return 'No date set';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date set';

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function ActivityScreen() {
  const [pets, setPets] = useState<PetRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [activityType, setActivityType] = useState('walk');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);

    const [nextPets, nextActivities] = await Promise.all([getPets(), getActivities()]);
    setPets(nextPets);
    setActivities(nextActivities);
    setLoading(false);
  };

  useEffect(() => {
    void loadActivities();
  }, []);

  const visibleActivities =
    selectedPetId === 'all' ? activities : activities.filter((item) => item.pet_id === selectedPetId);

  const handleCreateActivity = async () => {
    const petId = selectedPetId === 'all' ? pets[0]?.id : selectedPetId;

    if (!petId) {
      setError('Select a pet before adding activity.');
      return;
    }

    setSaving(true);
    setError(null);

    const { error: createError } = await createActivity({
      pet_id: petId,
      activity_type: activityType.trim() || 'walk',
      notes: notes.trim() || null,
      duration_minutes: Number(duration) || 0,
      activity_date: new Date().toISOString(),
    });

    setSaving(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    setNotes('');
    setDuration('30');
    void loadActivities();
  };

  const handleDeleteActivity = async (id: string) => {
    const { error: deleteError } = await deleteActivity(id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    void loadActivities();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Activity</Text>

      <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48', marginBottom: 18 }}>
        <Text style={{ color: '#edf8ff', fontWeight: '700', marginBottom: 10 }}>Log activity</Text>

        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: '#9cb6c7', marginBottom: 6 }}>Pet</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Pressable onPress={() => setSelectedPetId('all')} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: selectedPetId === 'all' ? '#2ec7a2' : '#0d2130' }}>
              <Text style={{ color: selectedPetId === 'all' ? '#061d1d' : '#dffcff', fontWeight: '700' }}>All pets</Text>
            </Pressable>
            {pets.map((pet) => (
              <Pressable key={pet.id} onPress={() => setSelectedPetId(pet.id)} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: selectedPetId === pet.id ? '#2ec7a2' : '#0d2130' }}>
                <Text style={{ color: selectedPetId === pet.id ? '#061d1d' : '#dffcff', fontWeight: '700' }}>{pet.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <TextInput
          value={activityType}
          onChangeText={setActivityType}
          placeholder="Activity type"
          placeholderTextColor="#7a9ab1"
          style={{ backgroundColor: '#0d2130', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f4fbff', marginBottom: 10 }}
        />

        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="Duration (minutes)"
          placeholderTextColor="#7a9ab1"
          style={{ backgroundColor: '#0d2130', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f4fbff', marginBottom: 10 }}
        />

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          placeholderTextColor="#7a9ab1"
          style={{ backgroundColor: '#0d2130', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f4fbff', marginBottom: 12 }}
        />

        <Pressable
          onPress={() => void handleCreateActivity()}
          disabled={saving}
          style={{ backgroundColor: '#2ec7a2', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#061d1d', fontWeight: '800' }}>{saving ? 'Saving...' : 'Save activity'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}

      {loading ? (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator color="#8ae0c5" />
        </View>
      ) : visibleActivities.length === 0 ? (
        <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#cfe8f9', textAlign: 'center' }}>No activity yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 14 }}>
          {visibleActivities.map((item) => {
            const petName = pets.find((pet) => pet.id === item.pet_id)?.name ?? 'Pet';

            return (
              <View key={item.id} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
                <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 16 }}>{item.activity_type}</Text>
                <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{petName} • {item.duration_minutes ?? 0} min</Text>
                {item.notes ? <Text style={{ color: '#9cb6c7', marginTop: 6 }}>{item.notes}</Text> : null}
                <Text style={{ color: '#8ae0c5', marginTop: 10, fontSize: 12 }}>{formatActivityDate(item.activity_date ?? item.created_at)}</Text>

                <Pressable onPress={() => void handleDeleteActivity(item.id)} style={{ marginTop: 12, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#ff8a8a', fontWeight: '700' }}>Delete</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
