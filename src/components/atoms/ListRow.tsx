import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import Switch from './Switch';

const ListRow = ({
  title,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  switchValue,
  onSwitchChange,
}) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.leftSection}>
        {leftIcon && <IconButton icon={leftIcon} size={24} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightSection}>
        x{rightText && <Text style={styles.rightText}>{rightText}</Text>}
        {switchValue !== undefined && (
          <Switch value={switchValue} onValueChange={onSwitchChange} />
        )}
        {rightIcon && <IconButton icon={rightIcon} size={24} />}
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

export default ListRow;
