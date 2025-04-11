import {ScreenName} from '@/app/navigation/ScreenName';
import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import {AvatarImageSource} from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
interface HeaderProps {
  navigation: NavigationProp<any>; // Navigation object to handle navigation actions
  profileImage: AvatarImageSource;
}

const Header: React.FC<HeaderProps> = ({navigation, profileImage}) => {
  return (
    <Appbar.Header style={styles.header}>
      <Avatar.Image
        size={30}
        source={profileImage} // Replace with your actual image path
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
    marginTop: 0,
  },
  avatar: {
    marginRight: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18, // Adjust to match the visual
    fontWeight: 'bold',
    textAlign: 'center', // Center the title
  },
});

export default Header;
