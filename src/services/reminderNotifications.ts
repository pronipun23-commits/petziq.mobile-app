import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { ReminderRow } from './supabase';

const REMINDER_CHANNEL_ID = 'reminders';

type NotifiableReminder = Pick<ReminderRow, 'id' | 'title' | 'notes' | 'due_at' | 'is_completed'>;

async function ensureReminderChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: 'Pet reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2ec7a2',
    });
  }
}

function isPermissionGranted(status: Notifications.NotificationPermissionsStatus) {
  return status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function getReminderNotificationsEnabled() {
  if (Platform.OS === 'web') return false;

  const status = await Notifications.getPermissionsAsync();
  return isPermissionGranted(status);
}

export async function requestReminderNotificationsPermission() {
  if (Platform.OS === 'web') return false;

  await ensureReminderChannel();
  const currentStatus = await Notifications.getPermissionsAsync();
  if (isPermissionGranted(currentStatus)) return true;

  const requestedStatus = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return isPermissionGranted(requestedStatus);
}

async function getScheduledReminderNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.filter((notification) => typeof notification.content.data?.reminderId === 'string');
}

async function cancelScheduledReminderNotifications(reminderId: string) {
  const scheduled = await getScheduledReminderNotifications();
  const matches = scheduled.filter((notification) => notification.content.data?.reminderId === reminderId);

  await Promise.all(matches.map((notification) =>
    Notifications.cancelScheduledNotificationAsync(notification.identifier),
  ));
}

async function scheduleReminderNotification(reminder: NotifiableReminder) {
  if (!reminder.due_at || reminder.is_completed) return false;

  const dueAt = new Date(reminder.due_at);
  if (Number.isNaN(dueAt.getTime()) || dueAt.getTime() <= Date.now()) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.notes || 'It is time for your pet reminder.',
      data: { reminderId: reminder.id },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dueAt,
      channelId: REMINDER_CHANNEL_ID,
    },
  });

  return true;
}

export async function syncReminderNotification(reminder: NotifiableReminder) {
  if (Platform.OS === 'web') return false;

  const enabled = await getReminderNotificationsEnabled();
  if (!enabled) return false;

  await ensureReminderChannel();
  await cancelScheduledReminderNotifications(reminder.id);
  return scheduleReminderNotification(reminder);
}

export async function cancelReminderNotification(reminderId: string) {
  if (Platform.OS === 'web') return;
  await cancelScheduledReminderNotifications(reminderId);
}

export async function syncPendingReminderNotifications(reminders: ReminderRow[]) {
  if (Platform.OS === 'web' || !(await getReminderNotificationsEnabled())) return;

  await ensureReminderChannel();
  const scheduled = await getScheduledReminderNotifications();
  const pendingReminders = reminders.filter((reminder) => {
    const dueAt = reminder.due_at ? new Date(reminder.due_at).getTime() : NaN;
    return !reminder.is_completed && Number.isFinite(dueAt) && dueAt > Date.now();
  });
  const pendingIds = new Set(pendingReminders.map((reminder) => reminder.id));

  await Promise.all(scheduled.map(async (notification) => {
    const reminderId = notification.content.data?.reminderId;
    if (typeof reminderId === 'string' && !pendingIds.has(reminderId)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }));

  const scheduledIds = new Set(scheduled.map((notification) => notification.content.data?.reminderId));
  await Promise.all(pendingReminders
    .filter((reminder) => !scheduledIds.has(reminder.id))
    .map(scheduleReminderNotification));
}