import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { Platform } from 'react-native';
import AppStateStore from 'Store/AppStateStore';

interface DailyRecapProps {
  date: string;
  totalSpent: number;
  transactionCount: number;
  topCategory: string;
  comparisonPercent: number;
  isHigher: boolean;
}

const DailyRecap = ({
  date = 'October 15, 2025',
  totalSpent = 156.42,
  transactionCount = 7,
  topCategory = 'Dining & Coffee',
  comparisonPercent = 18,
  isHigher = true,
}: DailyRecapProps) => {
  const { darkMode } = AppStateStore();

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={
        darkMode
          ? ['#1b2229', '#1b1d29', '#252836']
          : ['#edf5fc', '#ffffff', '#fcfbf2']
      }
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            color={darkMode ? '#f2f5f3' : '#000000'}
            name="calendar-clear-outline"
            size={18}
            style={styles.icon}
          />
          <AppText style={styles.title} numberOfLines={2}>
            Today's Spending Story
          </AppText>
        </View>
        <View style={styles.dateBadgeContainer}>
          <View style={styles.dateBadge}>
            <AppText style={styles.dateText}>{date}</AppText>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Summary Paragraph */}
        <Text style={[styles.paragraph, { color: darkMode ? '#e5e7eb' : '#1f2937' }]}>
          Today, you made{' '}
          <Text style={styles.highlightMono}>{transactionCount}</Text> transactions
          totaling{' '}
          <Text style={[styles.highlightAmount, { color: darkMode ? '#60a5fa' : '#2563eb' }]}>
            ${totalSpent.toFixed(2)}
          </Text>
          . Your biggest spending category was{' '}
          <Text style={styles.highlightBold}>{topCategory}</Text>.
        </Text>

        {/* Comparison Paragraph */}
        <Text style={[styles.paragraph, styles.paragraphSpaced, { color: darkMode ? '#e5e7eb' : '#1f2937' }]}>
          Compared to your daily average, you spent{' '}
          <Text
            style={[
              styles.comparisonText,
              { color: isHigher ? '#dc2626' : '#16a34a' },
            ]}>
            {comparisonPercent}% {isHigher ? 'more' : 'less'}
          </Text>{' '}
          today.{' '}
          {isHigher ? (
            <>
              <MaterialIcons size={16} color="#dc2626" name="trending-up" />{' '}
              <Text style={styles.advice}>
                Consider reviewing your purchases to ensure they align with your budget
                goals.
              </Text>
            </>
          ) : (
            <>
              <MaterialIcons size={16} color="#16a34a" name="trending-down" />{' '}
              <Text style={styles.advice}>
                Great job staying mindful of your spending!
              </Text>
            </>
          )}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default DailyRecap;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
  },
  dateBadgeContainer: {
    alignSelf: 'flex-start',
    marginTop: 0,
  },
  dateBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  paragraphSpaced: {
    marginTop: 12,
  },
  highlightMono: {
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  highlightAmount: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  highlightBold: {
    fontWeight: '700',
  },
  comparisonText: {
    fontWeight: '700',
  },
  advice: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.9,
  },
});