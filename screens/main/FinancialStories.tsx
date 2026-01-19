import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import FinancialStoriesItem from 'components/FinancialStoriesItem';
import DailyRecap from 'components/DailyRecap';
import Screen from 'components/Screen';
import AppText from 'components/AppText';
import AppStateStore from 'Store/AppStateStore';
import { analyticsService, TransformedStory, PlaidTransaction } from 'services/analytics';

interface DailyRecapData {
  totalSpent: number;
  transactionCount: number;
  topCategory: string;
  comparisonPercent: number;
  isHigher: boolean;
}

const FinancialStories = () => {
  const { darkMode } = AppStateStore();
  const [stories, setStories] = useState<TransformedStory[]>([]);
  const [dailyRecap, setDailyRecap] = useState<DailyRecapData>({
    totalSpent: 0,
    transactionCount: 0,
    topCategory: 'N/A',
    comparisonPercent: 0,
    isHigher: false,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data fallback
  const getMockStories = (): TransformedStory[] => [
    {
      timeline: 'this week',
      header: 'Weekend Warrior',
      text: 'You spent significantly more this weekend compared to your usual Friday-Sunday average. Most of it went to dining and entertainment.',
      insightValue: '+42%',
    },
    {
      timeline: 'this week',
      header: 'Coffee Habit',
      text: "Your daily coffee runs are adding up! You've visited coffee shops 12 times this week, spending an average of $6.50 per visit.",
      insightValue: '$78.00',
    },
    {
      timeline: 'this month',
      header: 'Grocery Savings',
      text: 'Great job! You spent 18% less on groceries this month compared to last month while maintaining the same number of shopping trips.',
      insightValue: '-18%',
    },
  ];

  // Helper to format category names
  const formatCategoryName = (category: string): string => {
    if (!category || category === 'null') return 'Other';

    const categoryNames: { [key: string]: string } = {
      'FOOD_AND_DRINK': 'Dining & Coffee',
      'GENERAL_MERCHANDISE': 'Shopping',
      'TRANSPORTATION': 'Transportation',
      'GENERAL_SERVICES': 'Utilities',
      'ENTERTAINMENT': 'Entertainment',
      'PERSONAL_CARE': 'Personal Care',
    };

    return categoryNames[category] || category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Calculate daily recap from transactions
  const calculateDailyRecap = (todayTransactions: PlaidTransaction[], yesterdayTransactions: PlaidTransaction[]): DailyRecapData => {
    // Calculate today's total spent (only positive amounts = actual spending)
    const totalSpent = todayTransactions.reduce((sum, t) => {
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      // Only count positive amounts (negative = refunds/income)
      return amount > 0 ? sum + amount : sum;
    }, 0);

    // Count only spending transactions (not refunds)
    const transactionCount = todayTransactions.filter(t => {
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return amount > 0;
    }).length;

    // Find top category (only from spending, not refunds)
    const categoryMap: { [key: string]: number } = {};
    todayTransactions.forEach(t => {
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      if (amount > 0) { // Only count actual spending
        const category = t.personal_finance_category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      }
    });

    let topCategory = 'N/A';
    let maxAmount = 0;
    Object.entries(categoryMap).forEach(([cat, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = formatCategoryName(cat);
      }
    });

    // Calculate comparison with yesterday (only positive amounts)
    const yesterdayTotal = yesterdayTransactions.reduce((sum, t) => {
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return amount > 0 ? sum + amount : sum;
    }, 0);

    let comparisonPercent = 0;
    let isHigher = false;

    if (yesterdayTotal > 0) {
      const difference = totalSpent - yesterdayTotal;
      comparisonPercent = Math.round((difference / yesterdayTotal) * 100);
      isHigher = difference > 0;
    } else if (totalSpent > 0) {
      // If yesterday was $0 but today has spending
      comparisonPercent = 100;
      isHigher = true;
    }


    return {
      totalSpent,
      transactionCount,
      topCategory,
      comparisonPercent: Math.abs(comparisonPercent),
      isHigher,
    };

  };

  // Fetch stories and daily recap from API
 const fetchStories = async (isRefreshing = false) => {
   try {
     if (isRefreshing) {
       setRefreshing(true);
     } else {
       setLoading(true);
     }
     setError(null);

     // Fetch stories
     const transformedStories = await analyticsService.getStories({
       limit: 50,
       offset: 0,
     });

     setStories(transformedStories);

     // Fetch today's transactions
     const today = new Date();
     const todayStr = today.toISOString().split('T')[0];

     let todayTransactions = await analyticsService.getTransactions({
       start_date: todayStr,
       end_date: todayStr,
     });

     // Filter out pending transactions (optional - remove these lines if you want to include pending)
     todayTransactions = todayTransactions.filter(t => !t.pending);

     // Fetch yesterday's transactions for comparison
     const yesterday = new Date(today);
     yesterday.setDate(yesterday.getDate() - 1);
     const yesterdayStr = yesterday.toISOString().split('T')[0];

     let yesterdayTransactions = await analyticsService.getTransactions({
       start_date: yesterdayStr,
       end_date: yesterdayStr,
     });

     // Filter out pending transactions (optional - remove these lines if you want to include pending)
     yesterdayTransactions = yesterdayTransactions.filter(t => !t.pending);

     // Calculate daily recap
     const recap = calculateDailyRecap(todayTransactions, yesterdayTransactions);
     setDailyRecap(recap);

   } catch (err) {
     const axiosError = err as AxiosError;

     if (axiosError.response?.status === 401) {
       setError('Session expired. Please log in again.');
     } else if (axiosError.response?.status === 500) {
       setError('Server error. Please try again later.');
     } else if (axiosError.message === 'Network Error') {
       setError('No internet connection. Showing offline data.');
     } else {
       setError('Failed to load stories. Please try again.');
     }

     console.error('Error fetching stories:', err);


   } finally {
     setLoading(false);
     setRefreshing(false);
   }
 };

  // Refresh handler
  const onRefresh = useCallback(() => {
    fetchStories(true);
  }, []);

  // Fetch stories on mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkMode ? '#f2f5f3' : '#141414'} />
          <AppText style={styles.loadingText}>Loading your stories...</AppText>
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <AppText style={styles.title}>Your Financial Stories</AppText>
          <AppText style={[styles.subtitle, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
            Personalized insights about your spending patterns, presented in an
            easy-to-understand format
          </AppText>
        </View>

        {/* Daily Recap */}
        <DailyRecap
          date={new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          totalSpent={dailyRecap.totalSpent}
          transactionCount={dailyRecap.transactionCount}
          topCategory={dailyRecap.topCategory}
          comparisonPercent={dailyRecap.comparisonPercent}
          isHigher={dailyRecap.isHigher}
        />

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, darkMode && styles.errorContainerDark]}>
            <AppText style={styles.errorText}>⚠️ {error}</AppText>
            <AppText style={styles.errorSubtext}>
              Showing offline data. Pull down to retry.
            </AppText>
          </View>
        )}

        {/* Recent Stories Section */}
        <AppText style={styles.sectionTitle}>
          Recent Stories {stories.length > 0 && `(${stories.length})`}
        </AppText>

        {stories.length > 0 ? (
          stories.map((item, index) => (
            <FinancialStoriesItem item={item} key={`story-${index}`} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>No stories available yet</AppText>
            <AppText style={[styles.emptySubtext, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
              Check back soon for personalized insights
            </AppText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export default FinancialStories;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 10,
  },
  headerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
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
    marginBottom: 16,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});