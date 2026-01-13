import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AppScreen from '../../components/Screen';
import AppText from 'components/AppText';
import AppStateStore from 'Store/AppStateStore';

type Props = NativeStackScreenProps<MainStackParamList, 'ChangePassword'>;

export const ChangePasswordScreen = ({ navigation }: Props) => {
  const { darkMode } = AppStateStore();
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // TODO: Implement change password logic
    navigation.goBack();
  };

  return (
    <AppScreen
      className="flex-1 bg-background dark:bg-dark-background"
      style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{
          borderColor: darkMode ? '#374151' : '#e5e7eb',
        }}
        className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <AppText className="font-bold text-xl text-primary dark:text-dark-primary">
          Change Password
        </AppText>
        <TouchableOpacity className="p-2" onPress={handleSave}>
          <AppText className="font-medium text-primary dark:text-dark-primary">Save</AppText>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView className="flex-1 p-4">
        <View className="space-y-4">
          <View>
            <AppText
              darkModeColor="#9ca3af"
              lightModeColor="#4b5563"
              className="mb-2 text-gray-600 dark:text-gray-400">
              Current Password
            </AppText>
            <TextInput
              style={{
                backgroundColor: darkMode ? '#1E1E1E' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#fff' : '#000',
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-primary dark:border-gray-700 dark:bg-dark-surface dark:text-dark-primary"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor="#666666"
              secureTextEntry
            />
          </View>

          <View>
            <AppText
              darkModeColor="#9ca3af"
              lightModeColor="#4b5563"
              className="mb-2 text-gray-600 dark:text-gray-400">
              New Password
            </AppText>
            <TextInput
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#fff' : '#000',
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-primary dark:border-gray-700 dark:bg-dark-surface dark:text-dark-primary"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#666666"
              secureTextEntry
            />
          </View>

          <View>
            <Text className="mb-2 text-gray-600 dark:text-gray-400">Confirm New Password</Text>
            <TextInput
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#fff' : '#000',
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-primary dark:border-gray-700 dark:bg-dark-surface dark:text-dark-primary"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#666666"
              secureTextEntry
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
};
