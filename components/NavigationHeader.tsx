import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import AppText from './AppText';
import AppStateStore from 'Store/AppStateStore';

interface NavigationHeaderProps {
  showBackButton?: boolean;
  showText?: boolean;
}

const NavigationHeader = ({ showBackButton = true, showText = true }: NavigationHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { darkMode, setDarkMode, setUseDeviceColorScheme } = AppStateStore();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      {showBackButton ? (
        <TouchableOpacity style={styles.iconButton} onPress={navigation.goBack}>
          <MaterialIcons
            color={!darkMode ? '#141414' : '#f2f5f3'}
            name="arrow-back"
            size={24}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}

      {showText && (
        <AppText className="font-bold text-xl text-primary dark:text-dark-primary">
          BankrAI
        </AppText>
      )}

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          setDarkMode(!darkMode);
          setUseDeviceColorScheme(false);
        }}>
        <MaterialIcons
          color={!darkMode ? '#141414' : '#f2f5f3'}
          name={!darkMode ? 'dark-mode' : 'light-mode'}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  lightContainer: {
    backgroundColor: '#f2f5f3',
    borderBottomColor: '#e5e7eb',
  },
  darkContainer: {
    backgroundColor: '#141414',
    borderBottomColor: '#374151',
  },
  iconButton: {
    padding: 8,
  },
});