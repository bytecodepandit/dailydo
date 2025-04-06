import {RootStackParamList} from '@/app/navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {IconButton} from 'react-native-paper';

interface ProfileAvatarWithEditScreenProps
  extends NativeStackScreenProps<RootStackParamList> {
  size?: number;
  source: ImageSourcePropType;
  onPressEdit?: () => void;
}

const ProfileAvatarWithEdit: React.FC<ProfileAvatarWithEditScreenProps> = ({
  size = 100,
  source,
  onPressEdit,
}) => {
  return (
    <View style={styles.container}>
      <Image width={size} height={size} source={source} resizeMode="contain" />
      <TouchableOpacity
        onPress={onPressEdit}
        style={[styles.editButton, {bottom: 0, right: 5}]}>
        <View style={styles.cameraIconContainer}>
          <IconButton
            icon="camera"
            size={size * 0.1}
            iconColor="white"
            style={{margin: 0}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
  },
  cameraIconContainer: {
    backgroundColor: '#1e88e5', // Example blue color
    borderRadius: 50, // Make it circular
    padding: 5, // Adjust padding as needed
  },
});

export default ProfileAvatarWithEdit;
