import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

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
      <CameraView style={{ flex: 1 }} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={({ data }) => console.log('QR scanned:', data)} />
      <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 240, height: 240, borderWidth: 2, borderColor: '#8ae0c5', borderRadius: 24 }} />
      </View>
      <View style={{ position: 'absolute', bottom: 28, left: 20, right: 20, backgroundColor: 'rgba(16,42,57,0.82)', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1d3a48' }}>
        <Text style={{ color: '#edf8ff', fontWeight: '700' }}>Scan a Petziq QR code</Text>
        <Text style={{ color: '#9cb6c7', marginTop: 6 }}>Position the code inside the frame to view the pet profile or tag details.</Text>
      </View>
    </SafeAreaView>
  );
}
