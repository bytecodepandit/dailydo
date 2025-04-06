import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {IconButtonProps} from 'react-native-paper';
import {IconButton} from '../atoms';
import Switch, {SwitchProps} from '../atoms/Switch';

interface ListRowProps {
  /**
   * The main title text of the list row.
   */
  title: string;
  /**
   * Name of the icon to display on the left side (using a library like Material Icons).
   */
  leftIcon?: string;
  /**
   * Name of the icon to display on the right side.
   */
  rightIcon?: string;
  /**
   * Text to display on the right side (e.g., a selected value).
   */
  rightText?: string;
  /**
   * Function to call when the row is pressed. If not provided, the row will be disabled.
   */
  onPress?: () => void;
  /**
   * Value for the switch component (if used).
   */
  switchValue?: boolean;
  /**
   * Function to call when the switch value changes.
   */
  onSwitchChange?: (value: boolean) => void;
  /**
   * Style for the entire row container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the text title.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Style for the right text.
   */
  rightTextStyle?: StyleProp<TextStyle>;
  /**
   * Props to pass down to the left IconButton.
   */
  leftIconProps?: Omit<IconButtonProps, 'icon' | 'size'>;
  /**
   * Props to pass down to the right IconButton.
   */
  rightIconProps?: Omit<IconButtonProps, 'icon' | 'size'>;
  /**
   * Props to pass down to the Switch component.
   */
  switchProps?: Omit<SwitchProps, 'value' | 'onValueChange'>;
}

const ListRow: React.FC<ListRowProps> = ({
  title,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  switchValue,
  onSwitchChange,
  style,
  titleStyle,
  rightTextStyle,
  leftIconProps,
  rightIconProps,
  switchProps,
}) => {
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <IconButton icon={leftIcon} size={24} {...leftIconProps} />
        )}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.rightSection}>
        {rightText && (
          <Text style={[styles.rightText, rightTextStyle]}>{rightText}</Text>
        )}
        {switchValue !== undefined && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            {...switchProps}
          />
        )}
        {rightIcon && (
          <IconButton icon={rightIcon} size={24} {...rightIconProps} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 16,
    fontSize: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    marginRight: 16,
    color: '#777',
  },
});

export type {ListRowProps};
export default ListRow;
