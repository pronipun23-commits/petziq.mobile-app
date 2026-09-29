import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { createReminder, deleteReminder, getReminders, updateReminder, type ReminderRow } from '../../services/supabase';
import {
  cancelReminderNotification,
  getReminderNotificationsEnabled,
  requestReminderNotificationsPermission,
  syncPendingReminderNotifications,
  syncReminderNotification,
} from '../../services/reminderNotifications';

const formatReminderTime = (dueAt?: string | null) => {
  if (!dueAt) return 'No date set';

  const value = new Date(dueAt);
  if (Number.isNaN(value.getTime())) return 'No date set';

  return value.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextReminders = await getReminders();
      setReminders(nextReminders);

      try {
        const enabled = await getReminderNotificationsEnabled();
        setNotificationsEnabled(enabled);
        if (enabled) await syncPendingReminderNotifications(nextReminders);
      } catch (notificationError) {
        console.warn('Could not sync reminder notifications:', notificationError);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load reminders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadReminders();
    }, [loadReminders]),
  );

  const handleCreateReminder = async () => {
    if (!title.trim()) {
      setError('Reminder title is required.');
      return;
    }

    const normalizedDueAt = dueAt.trim().replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/, '$1T$2:00');
    const parsedDueAt = new Date(normalizedDueAt);
    if (!dueAt.trim() || Number.isNaN(parsedDueAt.getTime())) {
      setError('Enter a valid due date and time.');
      return;
    }

    setSaving(true);
    setError(null);

    const { data: createdReminder, error: createError } = await createReminder({
      title: title.trim(),
      notes: notes.trim() || null,
      type: 'custom',
      due_at: parsedDueAt.toISOString(),
      is_completed: false,
    });

    setSaving(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    setTitle('');
    setNotes('');
    setDueAt('');
    if (createdReminder) {
      try {
        await syncReminderNotification(createdReminder);
        setNotificationsEnabled(await getReminderNotificationsEnabled());
      } catch (notificationError) {
        console.warn('Could not schedule reminder notification:', notificationError);
        setError('Reminder saved, but its notification could not be scheduled.');
      }
    }
    void loadReminders();
  };

  const handleToggleReminder = async (reminder: ReminderRow) => {
    const nextCompletedState = !Boolean(reminder.is_completed);

    const { error: updateError } = await updateReminder(reminder.id, {
      is_completed: nextCompletedState,
      completed_at: nextCompletedState ? new Date().toISOString() : null,
    });

    if (updateError) {
      setError(updateError.message);
      return;
    }

    try {
      if (nextCompletedState) {
        await cancelReminderNotification(reminder.id);
      } else {
        await syncReminderNotification({ ...reminder, is_completed: false });
      }
    } catch (notificationError) {
      console.warn('Could not update reminder notification:', notificationError);
    }

    void loadReminders();
  };

  const handleDeleteReminder = async (id: string) => {
    const { error: deleteError } = await deleteReminder(id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    try {
      await cancelReminderNotification(id);
    } catch (notificationError) {
      console.warn('Could not cancel reminder notification:', notificationError);
    }

    void loadReminders();
  };

  const handleEnableNotifications = async () => {
    try {
      const enabled = await requestReminderNotificationsPermission();
      setNotificationsEnabled(enabled);
      if (enabled) await syncPendingReminderNotifications(reminders);
    } catch (notificationError) {
      console.warn('Could not enable reminder notifications:', notificationError);
      setError('Could not enable reminder notifications. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 20 }}>
      <Text style={{ color: '#f4fbff', fontSize: 28, fontWeight: '800', marginBottom: 18 }}>Reminders</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#102a39', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1d3a48', marginBottom: 18 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ color: '#edf8ff', fontWeight: '700' }}>
            {notificationsEnabled ? 'Reminder alerts are on' : 'Get alerts for your reminders'}
          </Text>
          {!notificationsEnabled ? (
            <Text style={{ color: '#9cb6c7', fontSize: 12, marginTop: 4 }}>
              {Platform.OS === 'web' ? 'Device notifications are unavailable on web.' : 'Allow notifications to be reminded on time.'}
            </Text>
          ) : null}
        </View>
        {!notificationsEnabled && Platform.OS !== 'web' ? (
          <Pressable
            onPress={() => void handleEnableNotifications()}
            style={{ backgroundColor: '#2ec7a2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 }}
          >
            <Text style={{ color: '#061d1d', fontWeight: '800', fontSize: 12 }}>Enable</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48', marginBottom: 18 }}>
        <Text style={{ color: '#edf8ff', fontWeight: '700', marginBottom: 10 }}>Add reminder</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Reminder title"
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
        <TextInput
          value={dueAt}
          onChangeText={setDueAt}
          placeholder="YYYY-MM-DD HH:mm"
          placeholderTextColor="#7a9ab1"
          accessibilityLabel="Reminder due date and time"
          style={{ backgroundColor: '#0d2130', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#f4fbff', marginBottom: 12 }}
        />
        <Pressable
          onPress={() => void handleCreateReminder()}
          disabled={saving}
          style={{ backgroundColor: '#2ec7a2', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#061d1d', fontWeight: '800' }}>{saving ? 'Saving...' : 'Create reminder'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={{ color: '#ff8a8a', marginBottom: 12 }}>{error}</Text> : null}

      {loading ? (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator color="#8ae0c5" />
        </View>
      ) : reminders.length === 0 ? (
        <View style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1d3a48' }}>
          <Text style={{ color: '#cfe8f9', textAlign: 'center' }}>No reminders yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 14 }}>
          {reminders.map((item) => (
            <View key={item.id} style={{ backgroundColor: '#102a39', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#f4fbff', fontWeight: '700', fontSize: 16, flex: 1 }}>{item.title}</Text>
                <Pressable onPress={() => void handleToggleReminder(item)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: item.is_completed ? '#1f4d3b' : '#183348' }}>
                  <Text style={{ color: '#dffcff', fontSize: 11, fontWeight: '700' }}>{item.is_completed ? 'Done' : 'Mark done'}</Text>
                </Pressable>
              </View>

              {item.notes ? <Text style={{ color: '#9cb6c7', marginTop: 8 }}>{item.notes}</Text> : null}
              <Text style={{ color: '#9cb6c7', marginTop: 8 }}>{formatReminderTime(item.due_at)}</Text>

              <Pressable onPress={() => void handleDeleteReminder(item.id)} style={{ marginTop: 12, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#ff8a8a', fontWeight: '700' }}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
