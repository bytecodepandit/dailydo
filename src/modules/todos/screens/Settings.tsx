import {ScreenName} from '@/app/navigation/ScreenName';
import {ListRow} from '@components/atoms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Button, Divider, Text} from 'react-native-paper';
import ProfileHeader from '../components/ProfileHeader';

const SettingsScreen = ({navigation}) => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    // Navigate to the edit profile screen
    console.log('Edit Profile Pressed');
    // navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    // Navigate to the change password screen
    console.log('Change Password Pressed');
    // navigation.navigate('ChangePassword');
  };

  const handleLanguage = () => {
    // Navigate to the language selection screen
    console.log('Language Pressed');
    // navigation.navigate('LanguageSettings');
  };

  const handlePushNotificationsToggle = () => {
    setPushNotificationsEnabled(!pushNotificationsEnabled);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleVibrateToggle = () => {
    setVibrateEnabled(!vibrateEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    // Implement dark mode theme switching logic here
  };

  const handleAbout = () => {
    // Navigate to the about screen
    console.log('About Pressed');
    // navigation.navigate('AboutScreen');
  };

  const handleHelpSupport = () => {
    // Navigate to the help & support screen
    console.log('Help & Support Pressed');
    // navigation.navigate('HelpSupportScreen');
  };

  const handlePrivacyPolicy = () => {
    // Open the privacy policy (e.g., in a web view or browser)
    console.log('Privacy Policy Pressed');
    // Linking.openURL('https://example.com/privacy');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate(ScreenName.Login);
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <ProfileHeader
          name="John Doe"
          email="john.doe@example.com"
          onEditPress={handleEditProfile}
          profileImage={{
            uri: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
          }} // Replace with your image path
        />

        {/* Account Section */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account
          </Text>
          <ListRow
            title="Change Password"
            leftIcon="lock-outline"
            rightIcon="chevron-right"
            onPress={handleChangePassword}
          />
          <Divider />
          <ListRow
            title="Language"
            leftIcon="earth"
            rightText="English (US)"
            rightIcon="chevron-right"
            onPress={handleLanguage}
          />
          <Divider />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <ListRow
            title="Push Notifications"
            leftIcon="bell-outline"
            switchValue={pushNotificationsEnabled}
            onSwitchChange={handlePushNotificationsToggle}
          />
          <Divider />
          <ListRow
            title="Sound"
            leftIcon="volume-high"
            switchValue={soundEnabled}
            onSwitchChange={handleSoundToggle}
          />
          <Divider />
          <ListRow
            title="Vibrate"
            leftIcon="vibrate"
            switchValue={vibrateEnabled}
            onSwitchChange={handleVibrateToggle}
          />
          <Divider />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <ListRow
            title="Dark Mode"
            leftIcon="moon-outline"
            switchValue={darkModeEnabled}
            onSwitchChange={handleDarkModeToggle}
          />
          <Divider />
          <ListRow
            title="About"
            leftIcon="information-outline"
            rightIcon="chevron-right"
            onPress={handleAbout}
          />
          <Divider />
          <ListRow
            title="Help & Support"
            leftIcon="help-circle-outline"
            rightIcon="chevron-right"
            onPress={handleHelpSupport}
          />
          <Divider />
          <ListRow
            title="Privacy Policy"
            leftIcon="shield-outline"
            rightIcon="chevron-right"
            onPress={handlePrivacyPolicy}
          />
          <Divider />
        </View>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonLabel}>
          Log Out
        </Button>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: '#555',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    borderColor: '#d32f2f', // Example red color
  },
  logoutButtonLabel: {
    color: '#d32f2f',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#777',
  },
});

export default SettingsScreen;
