import { StyleSheet, View, ViewStyle } from 'react-native';
import AppStateStore from 'Store/AppStateStore';

interface ScreenProps {
  children?: any;
  style?: ViewStyle;
  className?: string;
}

const Screen = ({ className = '', children = null, style = {} }: ScreenProps) => {
  const { darkMode } = AppStateStore();
  return (
    <View
      style={[style, darkMode ? styles.darkModeBackground : styles.lightModeBackground]}
      className={`${className}`}>
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  lightModeBackground: {
    backgroundColor: '#f2f5f3',
  },
  darkModeBackground: {
    backgroundColor: '#141414',
  },
});
