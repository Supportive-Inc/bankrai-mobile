import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TipItem from 'components/TipItem';
import Screen from 'components/Screen';
import AppText from 'components/AppText';
import AppStateStore from 'Store/AppStateStore';
import { useState, useEffect, useCallback } from 'react';
import { analyticsService, TransformedTip } from 'services/analytics';
import { AxiosError } from 'axios';

const TipsScreen = () => {
  const { darkMode } = AppStateStore();
  const [tips, setTips] = useState<TransformedTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data fallback
  const getMockTips = (): TransformedTip[] => [
    {
      id: '1',
      header: 'Switch to Annual \nSubscriptions',
      text: 'Many of your monthly subscriptions offer annual plans with 15-20% discounts. Consider switching Netflix, Spotify, and Adobe Creative Cloud to annual billing.',
      tag: 'Subscriptions',
      highlightLabel: 'Potential Savings',
      highLight: '$240/year',
    },
    {
      id: '2',
      header: 'Meal Prep Sundays',
      text: 'You spend an average of $18 per day on takeout lunches. Preparing 5 meals on Sunday could reduce this to $6 per meal while improving nutrition and saving time during the week.',
      tag: 'Food',
      highlightLabel: 'Potential Savings',
      highLight: '$60/week',
    },
    {
      id: '3',
      header: 'Optimize Gas Spending',
      text: 'Using a gas rewards credit card (2-3% cashback) and planning your routes to visit the cheapest stations could reduce your fuel costs significantly.',
      tag: 'Transportation',
      highlightLabel: 'Potential Savings',
      highLight: '$30/month',
    },
  ];

  // Calculate total potential savings
  const calculateTotalSavings = (tips: TransformedTip[]): number => {
    let total = 0;
    tips.forEach(tip => {
      const savings = tip.highLight;
      // Extract numeric value from savings string (e.g., "$240/year" -> 240)
      const match = savings.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
      if (match) {
        const value = parseFloat(match[1].replace(/,/g, ''));

        // Normalize to yearly savings
        if (savings.includes('/month')) {
          total += value * 12;
        } else if (savings.includes('/week')) {
          total += value * 52;
        } else if (savings.includes('/year')) {
          total += value;
        } else {
          // Default to yearly
          total += value;
        }
      }
    });
    return Math.round(total);
  };

  // Fetch tips from API
  const fetchTips = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const transformedTips = await analyticsService.getTips({
        limit: 50,
        offset: 0,
      });

      setTips(transformedTips);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (axiosError.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (axiosError.message === 'Network Error') {
        setError('No internet connection. Showing offline data.');
      } else {
        setError('Failed to load tips. Please try again.');
      }

      console.error('Error fetching tips:', err);


    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh handler
  const onRefresh = useCallback(() => {
    fetchTips(true);
  }, []);

  // Fetch tips on mount
  useEffect(() => {
    fetchTips();
  }, []);

  const totalSavings = calculateTotalSavings(tips);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkMode ? '#f2f5f3' : '#141414'} />
          <AppText style={styles.loadingText}>Loading money-saving tips...</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? '#f2f5f3' : '#141414'}
          />
        }>
        <AppText className="mb-3 mt-2 font-bold text-3xl text-black">AI Money Tips</AppText>
        <Text style={{ color: 'gray' }} className="text-xl">
          Personalized recommendations to help you save money based on your spending patterns
        </Text>

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, darkMode && styles.errorContainerDark]}>
            <AppText style={styles.errorText}>⚠️ {error}</AppText>
            <AppText style={styles.errorSubtext}>
              Showing offline data. Pull down to retry.
            </AppText>
          </View>
        )}

        {/* AI Analysis Summary */}
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
              <FontAwesome6 size={18} style={{ marginRight: 5 }} color={'green'} name="brain" />
              <AppText className="font-bold text-2xl">AI Analysis</AppText>
            </View>
          </View>

          {tips.length > 0 ? (
            <AppText className="text-lg" style={{ marginBottom: 10 }}>
              I've analyzed your spending patterns and identified{' '}
              <Text className="font-bold">{tips.length} actionable tips</Text> to help you save money.
              {totalSavings > 0 && (
                <>
                  {' '}If you implement all these suggestions, you could save approximately{' '}
                  <Text className="font-bold text-2xl text-green-700">
                    ${totalSavings.toLocaleString()}+
                  </Text>{' '}
                  per year without significantly changing your lifestyle.
                </>
              )}{' '}
              Start with the tips that offer the highest savings and are easiest to implement.
            </AppText>
          ) : (
            <AppText className="text-lg" style={{ marginBottom: 10 }}>
              No tips available yet. Keep tracking your expenses and we'll provide personalized
              money-saving recommendations soon!
            </AppText>
          )}
        </LinearGradient>

        {/* Recommended Actions */}
        {tips.length > 0 && (
          <>
            <AppText style={{ marginVertical: 15 }} className="font-bold text-3xl text-black">
              Recommended Actions
            </AppText>
            {tips.map((item) => (
              <TipItem item={item} key={item.id} />
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default TipsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  errorContainerDark: {
    backgroundColor: '#450a0a',
    borderColor: '#7f1d1d',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#991b1b',
  },
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