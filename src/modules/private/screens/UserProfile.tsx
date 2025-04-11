import {RootStackParamList} from '@/app/navigation/types';
import {
  AnimatedSwitch,
  InputBox,
  ProfileAvatarWithEdit,
} from '@components/atoms';
import {yupResolver} from '@hookform/resolvers/yup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import * as yup from 'yup';

interface UserProfileScreenProps
  extends NativeStackScreenProps<RootStackParamList> {
  // You can add any specific props that might be passed to this screen
  // via navigation or other means here.
  // For example, if you were passing a user object:
  // user?: {
  //   id: string;
  //   name: string;
  //   email: string;
  // };
}

// Validation schema using yup
const schema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phoneNumber: yup.string().optional(), // You can add more specific phone number validation
  username: yup.string().required('Username is required'),
  bio: yup.string().optional(),
  website: yup.string().url('Invalid website URL').optional(),
  location: yup.string().optional(), // We'll handle the text part of location
});

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '+1 (555) 123-4567',
      username: '@sarahjohnson',
      bio: 'Digital product designer based in San Francisco. Love creating beautiful and functional interfaces.',
      website: 'https://sarahjohnson.design',
      location: 'San Francisco, CA', // We'll manage the text part here
    },
    mode: 'onChange', // Validate on every input change
  });

  const [isPrivate, setIsPrivate] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = data => {
    console.log('Save Profile Data:', data);
    console.log('Is Private:', isPrivate);
    // Implement save logic here, 'data' will contain the validated form values
  };

  const handleChangePhoto = () => {
    console.log('Change Photo');
    // Implement image selection logic here
  };

  const handleDeleteAccount = () => {
    console.log('Delete Account');
    // Implement delete account confirmation and logic
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Edit Profile" />
        <Appbar.Action
          icon="content-save"
          onPress={handleSubmit(handleSave)}
          disabled={!isValid}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <ProfileAvatarWithEdit
            navigation={navigation}
            route={route}
            size={120}
            source={{
              uri: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
            }}
            onPressEdit={handleChangePhoto}
          />
        </View>

        <View style={styles.inputContainer}>
          <InputBox
            name="fullName"
            label="Full Name"
            control={control}
            errors={errors}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <InputBox
              name="email"
              label="Email"
              control={control}
              errors={errors}
              placeholder="Enter your email"
              containerStyles={{flex: 1}}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <InputBox
            name="phoneNumber"
            label="Phone Number"
            control={control}
            errors={errors}
            placeholder="Enter your phone no."
          />
        </View>

        <View style={styles.inputContainer}>
          <InputBox
            name="username"
            label="Username"
            control={control}
            errors={errors}
            placeholder="Enter your username"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputBox
            name="bio"
            label="Bio"
            control={control}
            errors={errors}
            placeholder="Enter your bio"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputBox
            name="website"
            label="Website"
            control={control}
            errors={errors}
            placeholder="Enter your website url"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <InputBox
              name="location"
              label="Location"
              control={control}
              errors={errors}
              placeholder="Enter your address"
              containerStyles={{flex: 1}}
            />
          </View>
        </View>

        <View style={styles.privateAccountContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Private Account</Text>
            <Text style={styles.secondaryText}>
              Only approved followers can see your content
            </Text>
          </View>
          <AnimatedSwitch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
          />
        </View>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.deleteAccountButton}>
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  changePhotoButton: {
    marginTop: -8,
    alignItems: 'center',
  },
  cameraIconContainer: {
    backgroundColor: '#1e88e5',
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  changePhotoText: {
    color: '#1e88e5',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  secondaryText: {
    color: '#777',
    fontSize: 14,
  },
  privateAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  deleteAccountButton: {
    marginVertical: 32,
    alignItems: 'center',
  },
  deleteAccountText: {
    color: '#e53935',
    fontSize: 16,
  },
});

export default UserProfileScreen;
