import React from 'react';
import {
  Switch as PaperSwitch,
  SwitchProps as PaperSwitchProps,
} from 'react-native-paper';

interface SwitchProps extends PaperSwitchProps {
  // You can add your own specific props here if needed
  // For example, a custom track color:
  // customTrackColor?: { false: string; true: string };
}

const Switch: React.FC<SwitchProps> = props => <PaperSwitch {...props} />;

export type {SwitchProps};
export default Switch;
