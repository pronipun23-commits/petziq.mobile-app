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
import LostPetScreen from '../screens/smart-tags/LostPetScreen';
import PlantsScreen from '../screens/plants/PlantsScreen';
import PetziqAIScreen from '../screens/ai/PetziqAIScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
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
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="Main" component={MainTabs} />
    </AuthStack.Navigator>
  );
}

export {
  PetProfileScreen,
  AddPetScreen,
  PetHealthScreen,
  ActivateTagScreen,
  QRScannerScreen,
  LostPetScreen,
};
