import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Or any other icon library

interface SocialButtonProps {
  title: string;
  iconName?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  iconName,
  onPress,
  backgroundColor,
  textColor,
}) => {
  const theme = useTheme();
  const buttonStyle = {
    ...styles.button,
    backgroundColor: backgroundColor || theme.colors.surface,
  };
  const textStyle = {
    color: textColor || theme.colors.text,
  };

  return (
    <Button
      mode="contained"
      style={buttonStyle}
      labelStyle={textStyle}
      onPress={onPress}
      icon={
        iconName
          ? () => (
              <Icon
                name={iconName}
                size={20}
                color={textColor || theme.colors.text}
              />
            )
          : undefined
      }>
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
});

export default SocialButton;
