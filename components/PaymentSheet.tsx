// PaymentSheet.tsx - Simple trigger component
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentSheetProps {
  onViewPlans: () => void;
  onClose?: () => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({
  onViewPlans,
  onClose
}) => {
  return (
    <View className="p-6 relative">
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-2 right-2 z-10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      )}

      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-full bg-red-500 items-center justify-center mb-4">
          <Ionicons name="lock-closed" size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold text-primary dark:text-dark-primary mb-2 text-center">
          Subscription Required
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          You've reached your free message limit. Please subscribe to continue using BankrAI.
        </Text>
      </View>

      <TouchableOpacity
        className="bg-primary dark:bg-dark-primary rounded-lg py-4 items-center mb-4"
        onPress={onViewPlans}
      >
        <Text className="text-white dark:text-black text-lg font-semibold">
          View Subscription Plans
        </Text>
      </TouchableOpacity>
    </View>
  );
};