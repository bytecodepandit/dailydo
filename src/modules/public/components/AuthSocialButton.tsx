import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';

const AuthSocialButton = ({icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Avatar.Icon
        size={40}
        icon={icon}
        color="'#000'"
        backgroundColor="#fff"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    elevation: 2, // Add a subtle shadow
  },
});

export default AuthSocialButton;
