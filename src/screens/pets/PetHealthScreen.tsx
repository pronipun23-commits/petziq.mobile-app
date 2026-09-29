import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { getDailyCareChecklist, getPet, saveCareChecklistItem, type CareChecklistRow, type PetRow } from '../../services/supabase';

const careTasks = [
  { type: 'food', label: 'Food' },
  { type: 'water', label: 'Water' },
  { type: 'exercise', label: 'Exercise' },
  { type: 'grooming', label: 'Grooming' },
  { type: 'play', label: 'Play' },
] as const;

export default function PetHealthScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const petId = route.params?.petId as string | undefined;
  const [pet, setPet] = useState<PetRow | null>(null);
  const [checklist, setChecklist] = useState<CareChecklistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHealthRecords = useCallback(async () => {
    if (!petId) {
      setError('Pet health records are missing their pet ID.');
      setLoading(false);
      return;
    }
    try {
      const [nextPet, allTasks] = await Promise.all([getPet(petId), getDailyCareChecklist()]);
      setPet(nextPet);
      setChecklist(allTasks.filter((task) => task.pet_id === petId));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load health records.');
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useFocusEffect(
    useCallback(() => {
      void loadHealthRecords();
    }, [loadHealthRecords]),
  );

  const toggleTask = async (taskType: string, taskLabel: string) => {
    if (!petId) return;
    const savedTask = checklist.find((task) => task.task_type === taskType);
    setSavingTask(taskType);
    setError(null);
    try {
      const { error: saveError } = await saveCareChecklistItem({
        pet_id: petId,
        task_type: taskType,
        task_label: taskLabel,
        is_completed: !savedTask?.is_completed,
      });
      if (saveError) {
        setError(saveError.message);
        return;
      }
      await loadHealthRecords();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update this care task.');
    } finally {
      setSavingTask(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <ArrowLeft size={20} color="#edf8ff" />
        </Pressable>
        <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>Care records</Text>
      </View>
      {loading ? <ActivityIndicator color="#8ae0c5" /> : null}
      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}
      {!loading && pet ? (
        <ScrollView contentContainerStyle={{ gap: 14 }}>
          <View style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
            <Text style={{ color: '#f4fbff', fontWeight: '800', fontSize: 20 }}>{pet.name}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 5 }}>{[pet.species, pet.breed].filter(Boolean).join(' · ')}</Text>
            {pet.notes ? <Text style={{ color: '#edf8ff', marginTop: 12, lineHeight: 21 }}>{pet.notes}</Text> : null}
          </View>
          <Text style={{ color: '#edf8ff', fontWeight: '700', fontSize: 18 }}>Today&apos;s care checklist</Text>
          {careTasks.map((task) => {
            const completed = checklist.find((item) => item.task_type === task.type)?.is_completed ?? false;
            return (
              <Pressable key={task.type} onPress={() => void toggleTask(task.type, task.label)} disabled={savingTask === task.type} style={{ backgroundColor: '#102a39', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1d3a48', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: '#edf8ff', fontWeight: '600' }}>{task.label}</Text>
                <Text style={{ color: completed ? '#8ae0c5' : '#9cb6c7', fontWeight: '700' }}>{savingTask === task.type ? 'Saving...' : completed ? 'Done' : 'Mark done'}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
