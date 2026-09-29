import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, PawPrint, BellRing, Activity, QrCode, Leaf, Bot, UserRound } from 'lucide-react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MyPetsScreen from '../screens/home/MyPetsScreen';
import RemindersScreen from '../screens/home/RemindersScreen';
import ActivityScreen from '../screens/home/ActivityScreen';
import PetProfileScreen from '../screens/pets/PetProfileScreen';
import AddPetScreen from '../screens/pets/AddPetScreen';
import PetHealthScreen from '../screens/pets/PetHealthScreen';
import MyTagsScreen from '../screens/smart-tags/MyTagsScreen';
import ActivateTagScreen from '../screens/smart-tags/ActivateTagScreen';
import QRScannerScreen from '../screens/smart-tags/QRScannerScreen';
import PlantsScreen from '../screens/plants/PlantsScreen';
import PetziqAIScreen from '../screens/ai/PetziqAIScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { supabase } from '../services/supabase';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d1b26',
          borderTopColor: '#1d3a48',
          height: 76,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#2ec7a2',
        tabBarInactiveTintColor: '#8da6b7',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tab.Screen
        name="MyPets"
        component={MyPetsScreen}
        options={{ tabBarIcon: ({ color, size }) => <PawPrint size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ tabBarIcon: ({ color, size }) => <BellRing size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarIcon: ({ color, size }) => <Activity size={size} color={color} /> }}
      />
      <Tab.Screen
        name="SmartTags"
        component={MyTagsScreen}
        options={{ tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Plants"
        component={PlantsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Leaf size={size} color={color} /> }}
      />
      <Tab.Screen
        name="AI"
        component={PetziqAIScreen}
        options={{ tabBarIcon: ({ color, size }) => <Bot size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitializing(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Session restore error:', error.message);
      setSession(data.session);
      setInitializing(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#07141d', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#8ae0c5" />
      </View>
    );
  }

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <AuthStack.Screen name="Main" component={AuthenticatedNavigator} />
      ) : (
        <>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </AuthStack.Navigator>
  );
}

function AuthenticatedNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen name="AddPet" component={AddPetScreen} />
      <MainStack.Screen name="PetProfile" component={PetProfileScreen} />
      <MainStack.Screen name="PetHealth" component={PetHealthScreen} />
      <MainStack.Screen name="ActivateTag" component={ActivateTagScreen} />
      <MainStack.Screen name="QRScanner" component={QRScannerScreen} />
    </MainStack.Navigator>
  );
}

export {
  PetProfileScreen,
  AddPetScreen,
  PetHealthScreen,
  ActivateTagScreen,
  QRScannerScreen,
};
