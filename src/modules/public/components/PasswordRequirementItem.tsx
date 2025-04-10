import React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';

interface PasswordRequirementItemProps {
  text: string;
  isMet: boolean;
}

const PasswordRequirementItem: React.FC<PasswordRequirementItemProps> = ({
  text,
  isMet,
}) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon={isMet ? 'check-circle-outline' : 'radiobox-blank'}
        size={20}
        iconColor={isMet ? 'green' : 'gray'}
      />
      <Text style={[styles.text, isMet && styles.metText]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  text: {
    marginLeft: 5,
    color: '#555',
  },
  metText: {
    color: 'green',
  },
});

export default PasswordRequirementItem;
