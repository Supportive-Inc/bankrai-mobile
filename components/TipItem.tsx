import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AppText from './AppText';
import AppStateStore from 'Store/AppStateStore';

interface FinancialStoriesItemProps {
  item: {
    tag: string;
    header: string;
    text: string;
    highlightLabel: string;
    highLight: string;
  };
}

const TipItem = ({ item }: FinancialStoriesItemProps) => {
  const { darkMode } = AppStateStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#202020' : '#ffffff' },
      ]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons
            color="#e6ca9a"
            size={20}
            style={styles.icon}
            name="lightbulb-outline"
          />
          <AppText style={styles.headerText} numberOfLines={2}>
            {item.header}
          </AppText>
        </View>
        <View style={styles.tagContainer}>
          <AppText
            style={[
              styles.tag,
              darkMode && { color: '#cccccc', backgroundColor: 'rgba(0,0,0,0.4)' },
            ]}>
            {item.tag}
          </AppText>
        </View>
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: darkMode ? '#a2a3a6' : '#565657' },
        ]}>
        {item.text}
      </Text>

      {/* Highlight Box */}
      <View style={styles.highlightBox}>
        {item.highlightLabel && (
          <AppText style={styles.highlightLabel}>{item.highlightLabel}</AppText>
        )}
        <Text style={styles.highlightValue}>{item.highLight}</Text>
      </View>

      {/* Learn More Button */}
      <TouchableOpacity
        style={styles.learnMoreButton}
        onPress={() => {}}>
        <AppText style={styles.learnMoreText}>Learn More</AppText>
        <MaterialIcons
          color={darkMode ? '#f2f5f3' : '#141414'}
          name="arrow-forward-ios"
          size={15}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TipItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginRight: 6,
    marginTop: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  tag: {
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight: '700',
    fontSize: 12,
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  highlightBox: {
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,200,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,0,0.3)',
    borderRadius: 10,
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  highlightValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#16a34a',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  learnMoreText: {
    fontSize: 16,
  },
});