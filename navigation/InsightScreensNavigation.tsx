import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InsightsLandingScreen from 'screens/main/InsightsLandingScreen';
import FinancialStories from 'screens/main/FinancialStories';
import InsightAnalysisScreen from 'screens/main/InsightAnalysisScreen';
import TipsScreen from 'screens/main/TipsScreen';
import NavigationHeader from 'components/NavigationHeader';
// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();
const InsightScreensNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: (props) => <NavigationHeader showBackButton={false} />,
        }}
        name="Insight Home"
        component={InsightsLandingScreen}
      />
      <Stack.Screen
        name="Stories"
        options={{
          header: (props) => <NavigationHeader />,
        }}
        component={FinancialStories}
      />
      <Stack.Screen
        options={{
          header: (props) => <NavigationHeader />,
        }}
        name="Analysis"
        component={InsightAnalysisScreen}
      />
      <Stack.Screen
        options={{
          header: (props) => <NavigationHeader />,
        }}
        name="Tips"
        component={TipsScreen}
      />
    </Stack.Navigator>
  );
};

export default InsightScreensNavigation;
