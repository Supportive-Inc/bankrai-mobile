import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import AppText from './AppText';
import AppStateStore from 'Store/AppStateStore';

interface FinancialStoriesItemProps {
  item: {
    timeline: string;
    header: string;
    text: string;
    insightValue: string;
  };
}

const FinancialStoriesItem = ({ item }: FinancialStoriesItemProps) => {
  const { darkMode } = AppStateStore();

  const markdownStyles = {
    body: {
      color: darkMode ? '#a2a3a6' : '#565657',
      fontSize: 16,
      lineHeight: 22,
    },
    strong: {
      fontWeight: '700',
      color: darkMode ? '#f2f5f3' : '#141414',
    },
    text: {
      color: darkMode ? '#a2a3a6' : '#565657',
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 0,
    },
  };

  return (
    <View
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      {/* Timeline Badge */}
      <View
        style={[
          styles.timelineBadge,
          darkMode ? styles.darkBadge : styles.lightBadge,
        ]}>
        <AppText style={styles.timelineText}>{item.timeline}</AppText>
      </View>

      {/* Header */}
      <AppText style={styles.header}>{item.header}</AppText>

      {/* Description with Markdown Support */}
      <View style={styles.descriptionContainer}>
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      </View>

      {/* Insight Value Box */}
      <View
        style={[
          styles.insightBox,
          darkMode ? styles.darkInsightBox : styles.lightInsightBox,
        ]}>
        <AppText style={styles.insightValue}>{item.insightValue}</AppText>
      </View>

      {/* View Details Button */}
      <TouchableOpacity style={styles.detailsButton} onPress={() => {}}>
        <AppText style={styles.detailsText}>View Details</AppText>
        <MaterialCommunityIcons
          color={darkMode ? '#f2f5f3' : '#000000'}
          name="arrow-right"
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FinancialStoriesItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.08)',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  timelineBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  lightBadge: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  darkBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timelineText: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  insightBox: {
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  lightInsightBox: {
    backgroundColor: '#f9fafb',
  },
  darkInsightBox: {
    backgroundColor: '#0a0a0a',
  },
  insightValue: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: '500',
  },
});