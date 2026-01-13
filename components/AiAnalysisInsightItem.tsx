import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppStateStore from 'Store/AppStateStore';
import AppText from './AppText';

interface AiAnalysisInsightItemProps {
  item: {
    header: string;
    text: string;
    status: 'low' | 'medium' | 'high';
    buttonText?: string;
  };
}

const AiAnalysisInsightItem = ({ item }: AiAnalysisInsightItemProps) => {
  const { darkMode } = AppStateStore();

  const getStatusStyle = (status: string) => {
    const baseStyle = styles.statusBadge;

    switch (status) {
      case 'low':
        return [baseStyle, styles.statusLow];
      case 'medium':
        return [
          baseStyle,
          styles.statusMedium,
          darkMode && { color: '#cccccc' },
        ];
      case 'high':
        return [baseStyle, styles.statusHigh];
      default:
        return [baseStyle, styles.statusMedium];
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#252626' : '#ffffff' },
      ]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            size={20}
            style={styles.icon}
            name="star-four-points-outline"
            color={darkMode ? '#f2f5f3' : '#141414'}
          />
          <AppText style={styles.headerText} numberOfLines={2}>
            {item.header}
          </AppText>
        </View>
        <View style={styles.statusContainer}>
          <AppText style={getStatusStyle(item.status)}>{item.status}</AppText>
        </View>
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: darkMode ? '#9ca3af' : '#4b5563' },
        ]}>
        {item.text}
      </Text>

      {/* Action Button */}
      {item.buttonText && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: darkMode ? '#141414' : '#f2f5f3' },
          ]}
          onPress={() => {}}>
          <Ionicons
            color={darkMode ? '#f2f5f3' : '#141414'}
            name="checkmark-outline"
            size={20}
            style={{ marginRight: 8 }}
          />
          <AppText style={styles.buttonText}>{item.buttonText}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AiAnalysisInsightItem;

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
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight: '700',
    fontSize: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    textTransform: 'capitalize',
  },
  statusLow: {
    color: '#16a34a',
    backgroundColor: 'rgba(0,250,0,0.1)',
    borderColor: '#16a34a',
  },
  statusMedium: {
    color: '#000000',
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.3)',
  },
  statusHigh: {
    color: '#dc2626',
    backgroundColor: 'rgba(250,0,0,0.1)',
    borderColor: '#dc2626',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
  },
});