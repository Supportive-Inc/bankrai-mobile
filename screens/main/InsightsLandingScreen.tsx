import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Screen from 'components/Screen';
import AppText from 'components/AppText';
const insightSections = [
  {
    title: 'Stories',
    description: 'Daily and weekly spending recaps in a story-like format',
    screenName: '',
    textColor: 'orange',
    icon: ({ color, ...props }: any) => (
      <Ionicons name="book-outline" {...props} color={'orange'} />
    ),
    color: 'bg-amber-500/20 border-amber-500/30 text-amber-500',
    path: 'Stories',
  },
  {
    title: 'Analysis',
    textColor: '#07437a',
    description: 'AI-powered insights and personalized recommendations',
    icon: ({ color, ...props }: any) => (
      <MaterialCommunityIcons color="#02294d" name="chart-line" {...props} />
    ),
    path: 'Analysis',
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-500',
  },
  {
    title: 'Tips',
    description: 'Money-saving tips and financial advice',
    textColor: 'green',
    icon: ({ color, ...props }: any) => (
      <MaterialIcons name="lightbulb-outline" {...props} color="green" />
    ),
    color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500',
    path: 'Tips',
  },
];

export default function InsightsLandingScreen() {
  const navigation = useNavigation<any>();
  return (
    <Screen>
      <ScrollView className="h-full pb-20">
        <View className="w-full max-w-[500px] space-y-6 self-center p-6">
          {/* Header */}
          <View className="items-center">
            <AppText className="mb-2 font-bold text-3xl">Insights</AppText>
            <Text className="text-center text-gray-500">
              Discover spending patterns, AI insights, and money-saving tips
            </Text>
          </View>

          {/* Grid */}
          <View className="mt-12 flex flex-col gap-6">
            {insightSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => navigation.navigate(section.path)}
                  className={`items-center rounded-2xl border-2 p-8 ${section.color}`}>
                  <View className={`mb-4 rounded-full p-6 ${section.color}`}>
                    <Icon size={48} color="black" />
                  </View>

                  <Text
                    style={{ color: section.textColor }}
                    className={`mb-2 text-center font-bold text-2xl`}>
                    {section.title}
                  </Text>

                  <Text className="text-center text-sm text-gray-500">{section.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </Screen>
  );
}
