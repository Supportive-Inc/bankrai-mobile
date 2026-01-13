import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AiAnalysisInsightItem from 'components/AiAnalysisInsightItem';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from 'components/Screen';
import AppText from 'components/AppText';
import AppStateStore from 'Store/AppStateStore';
import { useState, useEffect } from 'react';
import { analyticsService, Analysis } from 'services/analytics';

const InsightAnalysisScreen = () => {
  const { darkMode } = AppStateStore();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await analyticsService.getAnalyses();
      setAnalyses(data);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError('Failed to load insights. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const onRefresh = () => {
    fetchAnalyses(true);
  };

  // Calculate summary stats
  const highPriorityCount = analyses.filter(a => a.recommendation_severity === 'HIGH').length;
  const mediumPriorityCount = analyses.filter(a => a.recommendation_severity === 'MEDIUM').length;
  const lowPriorityCount = analyses.filter(a => a.recommendation_severity === 'LOW').length;
  const totalOpportunities = analyses.length;

  // Map API data to component format
  const mappedInsights = analyses.map(analysis => ({
    id: analysis.id,
    header: analysis.title,
    text: analysis.content,
    status: analysis.recommendation_severity.toLowerCase() as 'low' | 'medium' | 'high',
    buttonText: analysis.recommendation_severity === 'HIGH' ? 'Take Action' :
                analysis.recommendation_severity === 'MEDIUM' ? 'Learn More' : '',
  }));

  if (loading && !refreshing) {
    return (
      <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <AppText style={{ marginTop: 16 }}>Loading insights...</AppText>
      </Screen>
    );
  }

  return (
    <Screen style={{ flex: 1, paddingRight: 10, paddingLeft: 24 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AppText className="mb-1 mt-2 font-bold text-3xl text-black">AI-Powered Insights</AppText>
        <Text style={{ color: 'gray', marginBottom: 30 }} className="text-xl">
          Automated analysis of your finances with personalized recommendations
        </Text>

        {error && (
          <View className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Text className="text-red-600 dark:text-red-400">{error}</Text>
          </View>
        )}

        {/* tagline container */}
        <LinearGradient
          style={styles.taglineContainer}
          start={{ x: 0, y: 0.5 }}
          colors={darkMode ? ['#000b12', '#001207', '#120d00'] : ['#e4f1f5', '#f2fcf5', '#fcfbf2']}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View style={styles.taglineCalendarContainer}>
              <MaterialCommunityIcons
                size={25}
                style={{ marginRight: 5 }}
                name="star-four-points-outline"
                color={!darkMode ? '#141414' : '#f2f5f3'}
              />
              <AppText className="font-bold text-2xl">AI Analysis Summary</AppText>
            </View>
          </View>

          {totalOpportunities > 0 ? (
            <AppText className="text-lg" style={{ marginBottom: 10 }}>
              Based on your spending patterns, I've identified
              <Text className="font-bold"> {totalOpportunities} opportunities </Text>
              to improve your financial health.
              {highPriorityCount > 0 && (
                <>
                  {' '}You have <Text className="font-bold">{highPriorityCount} high-priority</Text>
                  {mediumPriorityCount > 0 && <>, <Text className="font-bold">{mediumPriorityCount} medium-priority</Text></>}
                  {lowPriorityCount > 0 && <>, and <Text className="font-bold">{lowPriorityCount} low-priority</Text></>}
                  {' '}recommendations.
                </>
              )}
            </AppText>
          ) : (
            <AppText className="text-lg" style={{ marginBottom: 10 }}>
              No insights available yet. Keep tracking your expenses and we'll provide personalized recommendations soon!
            </AppText>
          )}
        </LinearGradient>

        {/* Personalized Recommendations */}
        {mappedInsights.length > 0 && (
          <>
            <AppText style={{ marginVertical: 15 }} className="font-bold text-3xl text-black">
              Personalized Recommendations
            </AppText>
            {mappedInsights.map((item) => (
              <AiAnalysisInsightItem item={item} key={item.id} />
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default InsightAnalysisScreen;

const styles = StyleSheet.create({
  taglineContainer: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: 'rgba(50,50,250,0.1)',
    padding: 10,
    marginVertical: 10,
  },
  taglineCalendarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});