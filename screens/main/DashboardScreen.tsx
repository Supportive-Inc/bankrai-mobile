import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DollarSign,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Film,
  Zap,
  ChevronDown,
} from 'lucide-react-native';

// Mock data
const mockStats = [
  {
    title: 'Total Spent',
    value: '$1,234.56',
    trend: { value: 12, direction: 'up' },
    icon: DollarSign,
  },
  {
    title: 'Budget Remaining',
    value: '$1,265.44',
    trend: { value: 8, direction: 'down' },
    icon: TrendingDown,
  },
  {
    title: 'Transactions',
    value: '42',
    icon: CreditCard,
  },
  {
    title: 'Saved This Month',
    value: '$350.00',
    trend: { value: 5, direction: 'up' },
    icon: PiggyBank,
  },
];

const mockCategories = [
  { name: 'Dining & Coffee', amount: 342.5, percentage: 28, icon: Coffee, color: '#10b981' },
  { name: 'Shopping', amount: 278.9, percentage: 23, icon: ShoppingBag, color: '#f59e0b' },
  { name: 'Transportation', amount: 195.2, percentage: 16, icon: Car, color: '#8b5cf6' },
  { name: 'Utilities', amount: 156.0, percentage: 13, icon: Home, color: '#3b82f6' },
  { name: 'Entertainment', amount: 142.3, percentage: 12, icon: Film, color: '#ef4444' },
  { name: 'Other', amount: 119.66, percentage: 8, icon: Zap, color: '#6b7280' },
];

const timePeriods = [
  { label: 'This Week', value: 'week' },
  { label: '2 Weeks', value: '2weeks' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom Range', value: 'custom' },
];

interface StatCardProps {
  title: string;
  value: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: any;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.iconContainer}>
        <Icon size={20} color="#007AFF" />
      </View>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {trend && (
      <Text style={[styles.trend, trend.direction === 'up' ? styles.trendUp : styles.trendDown]}>
        {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
      </Text>
    )}
  </View>
);

interface CategoryCardProps {
  name: string;
  amount: number;
  percentage: number;
  icon: any;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  amount,
  percentage,
  icon: Icon,
  color,
}) => (
  <View style={styles.categoryCard}>
    <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
      <Icon size={24} color={color} />
    </View>
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{name}</Text>
      <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
    </View>
    <View style={styles.categoryPercentage}>
      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
  </View>
);

export const DashboardScreen = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedPeriod = timePeriods.find((p) => p.value === timePeriod);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Financial Overview</Text>
          <View style={styles.periodSelector}>
            <Text style={styles.periodLabel}>Your spending summary for</Text>
            <TouchableOpacity
              style={styles.periodButton}
              onPress={() => setShowTimePicker(!showTimePicker)}>
              <Text style={styles.periodText}>{selectedPeriod?.label}</Text>
              <ChevronDown size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Time Period Picker */}
          {showTimePicker && (
            <View style={styles.timePicker}>
              {timePeriods.map((period) => (
                <TouchableOpacity
                  key={period.value}
                  style={styles.timeOption}
                  onPress={() => {
                    setTimePeriod(period.value);
                    setShowTimePicker(false);
                  }}>
                  <Text
                    style={[
                      styles.timeOptionText,
                      period.value === timePeriod && styles.timeOptionActive,
                    ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {mockStats.map((stat, index) => (
            <View key={index} style={styles.statCardWrapper}>
              <StatCard {...stat} />
            </View>
          ))}
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.categoriesGrid}>
            {mockCategories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  periodText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  timePicker: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  timeOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#000',
  },
  timeOptionActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCardWrapper: {
    width: '48%',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#007AFF10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendUp: {
    color: '#34C759',
  },
  trendDown: {
    color: '#FF3B30',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryPercentage: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
});
