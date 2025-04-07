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
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
});

export default AuthSocialButton;
