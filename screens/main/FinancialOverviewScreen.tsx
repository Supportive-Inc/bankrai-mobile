import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useState, useEffect, useCallback } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { AxiosError } from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import FinancialOverviewExpenseChartItem from 'components/FinancialOverviewExpenseChartItem';
import FinancialOverviewCategoryCard from 'components/FinancialOverviewCategoryCard';
import Screen from 'components/Screen';
import AppText from 'components/AppText';
import AppStateStore from 'Store/AppStateStore';
import {
  analyticsService,
  OverviewMetrics,
  SpendingCategory,
  SpendingTrendData,
} from 'services/analytics';

// Constants
const TIME_PERIOD_OPTIONS = [
  { label: 'this week', value: 'week' },
  { label: '2 weeks', value: '2week' },
  { label: 'this month', value: 'month' },
];

const MONTHLY_BUDGET = 2500; //  make this configurable later

const FinancialOverviewScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({
    label: 'this week',
    value: 'week',
  });
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [trendData, setTrendData] = useState<SpendingTrendData | null>(null);
  const [categories, setCategories] = useState<SpendingCategory[]>([]);

  const { darkMode } = AppStateStore();

  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'white',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => (!darkMode ? '#141414' : '#f2f5f3'),
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: true,
    propsForLabels: {
      fontSize: 9,
    },
  };

  // Fetch financial data
  const fetchFinancialData = async (period: 'week' | '2week' | 'month', isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch transactions for selected period
      const transactions = await analyticsService.getTransactionsForPeriod(
        period,
        user.plaid_integration.id
      );

      // Fetch previous period transactions for comparison
      const previousPeriodStart = new Date();
      switch (period) {
        case 'week':
          previousPeriodStart.setDate(previousPeriodStart.getDate() - 14);
          break;
        case '2week':
          previousPeriodStart.setDate(previousPeriodStart.getDate() - 28);
          break;
        case 'month':
          previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 2);
          break;
      }

      const previousPeriodEnd = new Date();
      switch (period) {
        case 'week':
          previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 7);
          break;
        case '2week':
          previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 14);
          break;
        case 'month':
          previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);
          break;
      }

      const previousTransactions = await analyticsService.getTransactions({
        start_date: previousPeriodStart.toISOString().split('T')[0],
        end_date: previousPeriodEnd.toISOString().split('T')[0],
      });

      // Calculate metrics
      const calculatedMetrics = analyticsService.calculateOverviewMetrics(
        transactions,
        previousTransactions,
        MONTHLY_BUDGET
      );

      setMetrics(calculatedMetrics);

      // Generate spending trend
      const days = period === 'week' ? 7 : period === '2week' ? 14 : 30;
      const trend = analyticsService.generateSpendingTrend(transactions, days);
      setTrendData(trend);

      // Categorize spending
      const categorizedSpending = analyticsService.categorizeTransactions(transactions);
      setCategories(categorizedSpending);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (axiosError.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (axiosError.message === 'Network Error') {
        setError('No internet connection.');
      } else {
        setError('Failed to load financial data. Please try again.');
      }

      console.error('Error fetching financial data:', err);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePeriodChange = (item: any) => {
    setSelectedPeriod(item);
    setIsDropdownFocused(false);
    fetchFinancialData(item.value);
  };
  const formatoverviewMetricsSignalText = (amount: number, period: string) => {
    if (period === 'week') return `${Math.abs(amount)}% vs one week ago`;
    if (period === '2week') return `${Math.abs(amount)}% vs two weeks ago`;
    if (period === 'month') return `${Math.abs(amount)}% vs one month ago`;
  };

  const onRefresh = useCallback(() => {
    fetchFinancialData(selectedPeriod.value as any, true);
  }, [selectedPeriod]);

  useEffect(() => {
    fetchFinancialData(selectedPeriod.value as any);
  }, []);

  // Generate overview metrics for display
  const overviewMetrics = metrics
    ? [
        {
          title: 'Total Spent',
          amount: `$${metrics.totalSpent.toFixed(2)}`,
          signal: metrics.percentChanges.totalSpent > 0 ? 'up' : 'down',
          signalText: formatoverviewMetricsSignalText(
            metrics.percentChanges.totalSpent,
            selectedPeriod.value
          ), //`${Math.abs(metrics.percentChanges.totalSpent)}% ${selectedPeriod.label}${selectedPeriod.label === '2 weeks' ? ' ago' : ''}`,
          category: 'expense',
        },

         {
          title: 'Transactions',
          amount: `${metrics.transactionCount}`,
          signal: 'neutral',
          signalText: '',
          category: 'transaction-count',
        },

      ]
    : [];

  const getChartWidthMultiplier = () => {
    // 'week' | '2week' | 'month'
    if (selectedPeriod.value === 'week') return 1;
    if (selectedPeriod.value === '2week') return 2;
    if (selectedPeriod.value === 'month') return 4;
    return 1;
  };

  if (loading && !refreshing) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkMode ? '#f2f5f3' : '#141414'} />
          <AppText style={styles.loadingText}>Loading financial overview...</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? '#f2f5f3' : '#141414'}
          />
        }>
        {/* Header Section */}
        <View style={{ paddingTop: 12 }}>
          <AppText className="font-bold text-3xl" text="Financial Overview" />
        </View>

        <View style={styles.headerRow} className="flex-row items-center justify-between">
          <AppText style={styles.headerText} className="text-xl text-gray-700">
            Your spending summary for
          </AppText>

          <View style={[styles.dropdownContainer, darkMode && styles.darkContainer]}>
            <Dropdown
              style={[
                styles.dropdown,
                isDropdownFocused && styles.dropdownFocused,
                darkMode && styles.darkContainer,
              ]}
              placeholderStyle={[styles.placeholderStyle, darkMode && styles.darkText]}
              selectedTextStyle={[styles.selectedTextStyle, darkMode && styles.darkTextMuted]}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={TIME_PERIOD_OPTIONS}
              search={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isDropdownFocused ? 'Select item' : '...'}
              value={selectedPeriod}
              onFocus={() => setIsDropdownFocused(true)}
              onBlur={() => setIsDropdownFocused(false)}
              onChange={handlePeriodChange}
            />
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, darkMode && styles.errorContainerDark]}>
            <AppText style={styles.errorText}>⚠️ {error}</AppText>
          </View>
        )}

        {/* Overview Metrics */}
        {overviewMetrics.map((item, index) => (
          <FinancialOverviewExpenseChartItem item={item} key={`metric-${index}`} />
        ))}

        {/* Spending Trend Chart */}
        {trendData && (
          <>
            <AppText
              style={{ ...styles.sectionTitle, marginLeft: 20 }}
              className=" font-bold text-2xl">
              Spending Trend
            </AppText>
            <View style={[styles.chartContainer, , darkMode && styles.darkContainer]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}>
                <LineChart
                  bezier
                  data={trendData}
                  width={(Dimensions.get('screen').width - 20) * getChartWidthMultiplier()}
                  height={220}
                  chartConfig={chartConfig}
                  yAxisLabel="$"
                  fromZero={true}
                  withInnerLines={false}
                  // withScrollableDot={true}
                  verticalLabelRotation={-30}
                  style={{
                    ...(darkMode ? styles.darkContainer : styles.lightContainer),
                    overflow: 'visible',
                  }}
                />
              </ScrollView>
            </View>
          </>
        )}

        {/* Spending by Category */}
        {categories.length > 0 && (
          <>
            <AppText style={styles.sectionTitle} className="font-bold text-2xl">
              Spending by Category
            </AppText>

            {categories.map((item, index) => (
              <FinancialOverviewCategoryCard item={item as any} key={`category-${index}`} />
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default FinancialOverviewScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 0,
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
  },
  headerRow: {
    marginBottom: 16,
  },
  headerText: {
    marginRight: -10,
  },
  dropdownContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 150,
  },
  dropdown: {
    height: 36,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 5,
    overflow: 'hidden',
  },
  dropdownFocused: {
    borderColor: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  chartContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginVertical: 15,
    // paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f2f5f3',
    borderRadius: 16,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  darkContainer: {
    backgroundColor: '#141414',
  },
  lightContainer: {
    backgroundColor: '#f2f5f3',
  },
  darkText: {
    color: 'white',
  },
  darkTextMuted: {
    color: '#cccccc',
  },
});
