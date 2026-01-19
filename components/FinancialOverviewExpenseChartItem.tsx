import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AppStateStore from 'Store/AppStateStore';
import AppText from './AppText';
interface FinancialOverviewExpenseChartItemProps {
  item: {
    title: string;
    amount: string;
    signal: string;
    signalText: string;
    category: string;
  };
}

const FinancialOverviewExpenseChartItem = ({ item }: FinancialOverviewExpenseChartItemProps) => {
  const { darkMode } = AppStateStore();
  const getCardIconName = (category: string) => {
    switch (category) {
      case 'expense':
        return 'attach-money';
      case 'budget':
        return 'show-chart';
      case 'transaction-count':
        return 'credit-card';
      case 'savings':
        return 'savings';
      default:
        return '';
    }
  };
  const iconName = getCardIconName(item.category);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        marginVertical: 15,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: darkMode ? '#202020' : '#f2f5f3',
      }}
      className="flex-row items-center justify-between rounded-2xl bg-white ">
      <View>
        <Text style={{ marginBottom: 5 }} className="text-xl text-gray-600 ">
          {item.title}
        </Text>
        <AppText style={{ marginBottom: 5 }} className="font-bold text-2xl text-black ">
          {item.amount}
        </AppText>
        {item.signalText ? (
          <View className="flex-row items-center">
            <MaterialIcons
              style={{ marginRight: 3 }}
              name="show-chart"
              size={20}
              color={item.signal === 'up' ? 'red' : 'green'}
            />
            <Text
              className={`font-bold text-lg ${item.signal === 'up' ? 'text-red-700' : 'text-green-700'}`}>
              {item.signalText}
            </Text>
          </View>
        ) : null}
      </View>
      <View className="rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 7 }}>
        {iconName ? (
          <MaterialIcons color={darkMode ? '#f2f5f3' : '#141414'} size={25} name={iconName} />
        ) : null}
      </View>
    </View>
  );
};

export default FinancialOverviewExpenseChartItem;

const styles = StyleSheet.create({});
