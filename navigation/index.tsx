import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, AuthStackParamList, MainStackParamList } from '../types/navigation';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { DemoChatScreen } from '../screens/main/DemoChatScreen';
import { ChatScreen } from '../screens/main/ChatScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/main/ChangePasswordScreen';
import { SubscriptionScreen } from '../screens/main/SubscriptionScreen'; // Add this import
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AppStateStore from 'Store/AppStateStore';
import InsightsLandingScreen from 'screens/main/InsightsLandingScreen';
import SettingsScreen from 'screens/main/SettingsScreen';
import FinancialOverviewScreen from 'screens/main/FinancialOverviewScreen';
import TabNavigation from './TabNavigation';
const MainStack = createNativeStackNavigator<MainStackParamList>();

// Create stack navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
// const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="DemoChat" component={DemoChatScreen} />
    </AuthStack.Navigator>
  );
};

// Main Stack Navigator
// Main Stack Navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} /> {/* Changed from Profile */}
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
      <MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <MainStack.Screen name="Subscription" component={SubscriptionScreen} />
    </MainStack.Navigator>
  );
};


// Root Navigator
export const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { darkMode } = AppStateStore();
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: darkMode ? '#141414' : '#f2f5f3',
        },
      }}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={TabNavigation} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
