import { Children } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import AppStateStore from 'Store/AppStateStore';

interface AppTextProps {
  style?: TextStyle;
  className?: string;
  text?: string;
  children?: any;
  darkModeColor?: string;
  lightModeColor?: string;
}

const AppText = ({
  className = '',
  style = {},
  text = '',
  children = null,
  darkModeColor,
  lightModeColor,
}: AppTextProps) => {
  const { darkMode } = AppStateStore();
  return (
    <Text
      style={[
        darkMode
          ? { color: darkModeColor || styles.darkModeTextStyle.color }
          : { color: lightModeColor || styles.lightModeTextStyle.color },
        style,
      ]}
      className={className || ''}>
      {text || children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  darkModeTextStyle: {
    color: '#cccccc',
  },
  lightModeTextStyle: {
    color: '#000',
  },
});
