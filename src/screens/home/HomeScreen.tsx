import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PawPrint, Bell, Heart, CalendarClock, Activity, ArrowRight, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getActivities, getPets, getReminders, type ActivityRow, type PetRow, type ReminderRow } from '../../services/supabase';

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [pets, setPets] = useState<PetRow[]>([]);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [nextPets, nextReminders, nextActivities] = await Promise.all([getPets(), getReminders(), getActivities()]);
      setPets(nextPets);
      setReminders(nextReminders);
      setActivities(nextActivities);
    };

    void loadDashboardData();
  }, []);

  const upcomingReminders = reminders.filter((reminder) => !reminder.is_completed).length;
  const completedReminders = reminders.filter((reminder) => reminder.is_completed).length;
  const todayActivities = activities.filter((activity) => {
    if (!activity.activity_date) return false;
    const activityDate = new Date(activity.activity_date);
    const now = new Date();
    return (
      activityDate.getFullYear() === now.getFullYear() &&
      activityDate.getMonth() === now.getMonth() &&
      activityDate.getDate() === now.getDate()
    );
  }).length;
  const totalMinutes = activities.reduce((sum, activity) => sum + Number(activity.duration_minutes ?? 0), 0);

  const cards = [
    { label: 'My Pets', value: String(pets.length || 0), icon: PawPrint, route: 'MyPets' },
    { label: 'Reminders', value: String(upcomingReminders), icon: CalendarClock, route: 'Reminders' },
    { label: 'Activity', value: String(todayActivities || 0), icon: Activity, route: 'Activity' },
  ];

  const statusSummary = pets.length > 0 ? pets.filter((pet) => (pet.health_status || '').toLowerCase() !== 'poor').length : 0;
  const highlights = pets.slice(0, 2).map((pet) => ({
    name: pet.name,
    detail: `${pet.species || 'Pet'} • ${pet.health_status || 'healthy'}`,
    tint: '#7dd3fc',
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#2ec7a2', width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
              <PawPrint size={22} color="#061d1d" />
            </View>
            <Text style={{ marginLeft: 10, color: '#f4fbff', fontSize: 28, fontWeight: '800' }}>Petziq</Text>
          </View>
          <Pressable style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#112a39', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} color="#dffcff" />
          </Pressable>
        </View>

        <Text style={{ color: '#8ae0c5', fontWeight: '700', marginBottom: 6 }}>Good morning</Text>
        <Text style={{ color: '#f5fbff', fontSize: 30, fontWeight: '800', lineHeight: 38 }}>Your pets are ready for today.</Text>

        <View style={{ marginTop: 24, backgroundColor: '#102a39', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#edf8ff', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Care overview</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#0d2130', borderRadius: 14, padding: 14 }}>
              <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Tasks</Text>
              <Text style={{ color: '#f4fbff', fontSize: 26, fontWeight: '800' }}>{String(upcomingReminders).padStart(2, '0')}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#0d2130', borderRadius: 14, padding: 14 }}>
              <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Health</Text>
              <Text style={{ color: '#baf7df', fontSize: 26, fontWeight: '800' }}>{statusSummary > 0 ? 'Good' : 'Review'}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 24, marginBottom: 18 }}>
          <Text style={{ color: '#edf8ff', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Quick overview</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {cards.map(({ label, value, icon: Icon, route }) => (
              <Pressable key={label} onPress={() => navigation.navigate(route)} style={{ width: '31%', backgroundColor: '#112a39', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1d3a48' }}>
                <Icon size={20} color="#8ae0c5" />
                <Text style={{ color: '#f4fbff', fontWeight: '700', marginTop: 12 }}>{label}</Text>
                <Text style={{ color: '#9cb6c7', fontSize: 12, marginTop: 4 }}>{value}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: '#102a39', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1d3a48' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#edf8ff', fontSize: 18, fontWeight: '700' }}>Pet highlights</Text>
            <Sparkles size={18} color="#8ae0c5" />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <View style={{ flex: 1, backgroundColor: '#0d2130', borderRadius: 14, padding: 12 }}>
              <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Completed</Text>
              <Text style={{ color: '#f4fbff', fontSize: 20, fontWeight: '800' }}>{completedReminders}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12, backgroundColor: '#0d2130', borderRadius: 14, padding: 12 }}>
              <Text style={{ color: '#9cb6c7', fontSize: 12 }}>Minutes</Text>
              <Text style={{ color: '#f4fbff', fontSize: 20, fontWeight: '800' }}>{totalMinutes}</Text>
            </View>
          </View>

          <View style={{ marginTop: 16, gap: 12 }}>
            {highlights.length > 0 ? (
              highlights.map((pet) => (
                <View key={pet.name} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d2130', padding: 12, borderRadius: 14 }}>
                  <View>
                    <Text style={{ color: '#f4fbff', fontWeight: '700' }}>{pet.name}</Text>
                    <Text style={{ color: '#9cb6c7', fontSize: 12, marginTop: 4 }}>{pet.detail}</Text>
                  </View>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: pet.tint }} />
                </View>
              ))
            ) : (
              <Text style={{ color: '#9cb6c7' }}>No pets are synced yet.</Text>
            )}
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('Activity')} style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#112a39', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Heart size={18} color="#8ae0c5" />
            <Text style={{ color: '#edf8ff', marginLeft: 10, fontWeight: '700' }}>Open activity tracker</Text>
          </View>
          <ArrowRight size={18} color="#8ae0c5" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
