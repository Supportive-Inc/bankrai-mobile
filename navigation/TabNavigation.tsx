import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppStateStore from 'Store/AppStateStore';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ChatScreen } from 'screens/main/ChatScreen';
import FinancialOverviewScreen from 'screens/main/FinancialOverviewScreen';
import SettingsStackNavigator from '../navigation/SettingsStackNavigator'; // Import the stack
import InsightScreensNavigation from './InsightScreensNavigation';
import NavigationHeader from 'components/NavigationHeader';

const Tab = createBottomTabNavigator();

function TabNavigation() {
  const { darkMode } = AppStateStore();
  return (
    <Tab.Navigator
      screenOptions={{
        animation: 'shift',
        tabBarStyle: {
          borderTopWidth: 0.2,
          backgroundColor: darkMode ? '#141414' : '#F3F4F6',
        },
      }}>
      {/* chat tab */}
      <Tab.Screen
        name="Chat"
        component={ChatScreen as any}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <BottomTabIconWrapper size={size} focused={focused}>
                <Ionicons
                  name="chatbox"
                  color={darkMode && focused ? '#242423' : color}
                  size={size * 0.8}
                  style={{
                    borderRadius: 200,
                    padding: 2,
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  }}
                />
              </BottomTabIconWrapper>
            );
          },
        }}
      />

      {/* financial overview */}
      <Tab.Screen
        name="Financial Overview"
        component={FinancialOverviewScreen as any}
        options={{
          title: '',
          headerShown: true,
          header: (props) => <NavigationHeader showBackButton={false} />,
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <BottomTabIconWrapper size={size} focused={focused}>
                <MaterialCommunityIcons
                  name="view-grid-outline"
                  color={darkMode && focused ? '#242423' : color}
                  size={size * 0.8}
                  style={{
                    borderRadius: 200,
                    padding: 2,
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  }}
                />
              </BottomTabIconWrapper>
            );
          },
        }}
      />

      {/* insight */}
      <Tab.Screen
        name="Insight"
        component={InsightScreensNavigation as any}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <BottomTabIconWrapper size={size} focused={focused}>
                <MaterialIcons
                  name="lightbulb-outline"
                  color={darkMode && focused ? '#242423' : color}
                  size={size * 0.8}
                  style={{
                    borderRadius: 200,
                    padding: 2,
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  }}
                />
              </BottomTabIconWrapper>
            );
          },
        }}
      />

      {/* settings - now using the stack navigator */}
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator} // Changed to stack navigator
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <BottomTabIconWrapper size={size} focused={focused}>
                <Ionicons
                  name="settings-outline"
                  color={darkMode && focused ? '#242423' : color}
                  size={size * 0.8}
                  style={{
                    borderRadius: 200,
                    padding: 2,
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  }}
                />
              </BottomTabIconWrapper>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function BottomTabIconWrapper({ children, size, focused }: any) {
  return (
    <View
      style={{
        backgroundColor: focused ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
        borderRadius: size,
        overflow: 'hidden',
        padding: 2,
        height: size + 4,
        width: size + 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
}
export default TabNavigation;

const styles = StyleSheet.create({});
