import {ScreenName} from '@/app/navigation/ScreenName';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Avatar, IconButton} from 'react-native-paper';

const Header = ({navigation}) => {
  return (
    <Appbar.Header style={styles.header}>
      <Avatar.Image
        size={30}
        source={{
          uri: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
        }} // Replace with your actual image path
        style={styles.avatar}
      />
      <Appbar.Content title="My Tasks" titleStyle={styles.title} />
      <IconButton
        icon="cog"
        onPress={() => navigation.navigate(ScreenName.Settings)}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', // Assuming a white background
    elevation: 0, // Remove shadow if needed for a flat look
    paddingHorizontal: 16, // Adjust as needed
  },
  avatar: {
    marginRight: 16,
  },
  title: {
    fontSize: 18, // Adjust to match the visual
    fontWeight: 'bold',
    textAlign: 'center', // Center the title
  },
});

export default Header;
