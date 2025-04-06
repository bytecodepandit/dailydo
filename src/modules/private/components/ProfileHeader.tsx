import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, IconButton, Text} from 'react-native-paper';

const ProfileHeader = ({name, email, onEditPress, profileImage}) => {
  return (
    <View style={styles.container}>
      <Avatar.Image size={80} source={profileImage} />
      <View style={styles.info}>
        <Text style={{fontWeight: 'bold', fontSize: 24}}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <IconButton icon="pencil-outline" onPress={onEditPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  email: {
    color: '#777',
  },
});

export default ProfileHeader;
