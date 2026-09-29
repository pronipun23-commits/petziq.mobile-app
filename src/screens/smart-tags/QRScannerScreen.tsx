import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getPublicTagInfo } from '../../services/supabase';

export default function QRScannerScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [tagInfo, setTagInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (value: string) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    setError(null);
    const tagId = value.match(/PZ-\d+/i)?.[0];
    if (!tagId) {
      setError('This QR code does not contain a Petziq Smart Tag ID.');
      setLoading(false);
      return;
    }
    try {
      const result = await getPublicTagInfo(tagId);
      if (result.found === true) setTagInfo(result);
      else setError('No active public profile was found for this tag.');
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'Could not look up this tag.');
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#edf8ff' }}>Loading scanner…</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d', padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ position: 'absolute', top: 12, left: 16, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} color="#edf8ff" />
        </Pressable>
        <Text style={{ color: '#f4fbff', fontSize: 24, fontWeight: '800', textAlign: 'center' }}>Enable camera access</Text>
        <Text style={{ color: '#9cb6c7', textAlign: 'center', marginTop: 10 }}>Allow Petziq to scan a QR code on your pet tag or profile page.</Text>
        <Pressable onPress={requestPermission} style={{ marginTop: 24, backgroundColor: '#2ec7a2', paddingVertical: 14, paddingHorizontal: 26, borderRadius: 14 }}>
          <Text style={{ color: '#07141d', fontWeight: '800' }}>Enable camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#07141d' }}>
      <CameraView style={{ flex: 1 }} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={({ data }) => void handleScan(data)} />
      <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={{ position: 'absolute', top: 12, left: 16, width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(16,42,57,0.94)', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowLeft size={20} color="#edf8ff" />
      </Pressable>
      <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 240, height: 240, borderWidth: 2, borderColor: '#8ae0c5', borderRadius: 24 }} />
      </View>
      <View style={{ position: 'absolute', bottom: 28, left: 20, right: 20, backgroundColor: 'rgba(16,42,57,0.94)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
        {loading ? <Text style={{ color: '#edf8ff' }}>Looking up tag...</Text> : null}
        {error ? <Text style={{ color: '#ffb4b4' }}>{error}</Text> : null}
        {tagInfo ? (
          <ScrollView style={{ maxHeight: 180 }}>
            <Text style={{ color: '#edf8ff', fontWeight: '800', fontSize: 18 }}>{String(tagInfo.name || tagInfo.tag_id || 'Petziq tag')}</Text>
            <Text style={{ color: '#9cb6c7', marginTop: 5 }}>{String(tagInfo.tag_type || '')}</Text>
            {Object.entries((tagInfo.tag_details || {}) as Record<string, unknown>).map(([key, value]) => (
              <Text key={key} style={{ color: '#edf8ff', marginTop: 6 }}>{`${key}: ${String(value)}`}</Text>
            ))}
            {Object.entries((tagInfo.owner_info || {}) as Record<string, unknown>).map(([key, value]) => (
              <Text key={key} style={{ color: '#edf8ff', marginTop: 6 }}>{`${key}: ${String(value)}`}</Text>
            ))}
          </ScrollView>
        ) : null}
        {!loading && !error && !tagInfo ? <Text style={{ color: '#edf8ff', fontWeight: '700' }}>Scan a Petziq QR code</Text> : null}
        {scanned ? (
          <Pressable onPress={() => { setScanned(false); setTagInfo(null); setError(null); }} style={{ marginTop: 12, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#8ae0c5', fontWeight: '700' }}>Scan another</Text>
          </Pressable>
        ) : <Text style={{ color: '#9cb6c7', marginTop: 6 }}>Position the QR code inside the frame.</Text>}
      </View>
    </SafeAreaView>
  );
}
