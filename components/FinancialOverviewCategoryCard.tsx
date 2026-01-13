import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';

import AppText from './AppText';
import AppStateStore from 'Store/AppStateStore';

interface FinancialOverviewCategoryCardProps {
  item: {
    title: string;
    amount: string;
    percentValue: number;
    type: 'coffee' | 'shopping' | 'transport' | 'utility' | 'entertainment' | 'other';
    iconColor: string;
    iconBackgroundColor: string;
  };
}

const CATEGORY_ICONS = {
  coffee: 'coffee',
  shopping: 'shopping-bag',
  transport: 'directions-car',
  utility: 'house-siding',
  entertainment: 'movie',
  other: 'category',
} as const;

const SCREEN_WIDTH = Dimensions.get('window').width;

const FinancialOverviewCategoryCard = ({ item }: FinancialOverviewCategoryCardProps) => {
  const { darkMode } = AppStateStore();
  const iconName = CATEGORY_ICONS[item.type] || 'category';

  return (
    <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: item.iconBackgroundColor }]}>
            <MaterialIcons size={24} color={item.iconColor} name={iconName} />
          </View>

          <View style={styles.textContainer}>
            <AppText style={styles.title}>{item.title}</AppText>
            <AppText style={styles.subtitle}>
              {item.percentValue}% of total
            </AppText>
          </View>
        </View>

        <AppText style={styles.amount}>{item.amount}</AppText>
      </View>

      <View style={styles.progressContainer}>
        <Progress.Bar
          width={SCREEN_WIDTH - 60}
          color={item.iconBackgroundColor}
          progress={item.percentValue / 100}
          unfilledColor={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
          borderWidth={0}
          height={6}
          borderRadius={3}
        />
      </View>
    </View>
  );
};

export default FinancialOverviewCategoryCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: '#1a1a1a',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  lightCard: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
});