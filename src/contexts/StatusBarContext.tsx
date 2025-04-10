import React, {createContext, useContext, useState} from 'react';
import {StatusBar as RNStatusBar} from 'react-native';

interface StatusBarContextType {
  barStyle: 'default' | 'dark-content' | 'light-content';
  backgroundColor: string;
  translucent: boolean;
  setStatusBar: (options: {
    barStyle?: 'default' | 'dark-content' | 'light-content';
    backgroundColor?: string;
    translucent?: boolean;
  }) => void;
}

const StatusBarContext = createContext<StatusBarContextType | undefined>(
  undefined,
);

export const StatusBarProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [barStyle, setBarStyle] = useState<
    'default' | 'dark-content' | 'light-content'
  >('default');
  const [backgroundColor, setBackgroundColor] = useState<string>('blue');
  const [translucent, setTranslucent] = useState<boolean>(false);

  const setStatusBar = (options: {
    barStyle?: 'default' | 'dark-content' | 'light-content';
    backgroundColor?: string;
    translucent?: boolean;
  }) => {
    setBarStyle(options.barStyle !== undefined ? options.barStyle : barStyle);
    setBackgroundColor(
      options.backgroundColor !== undefined
        ? options.backgroundColor
        : backgroundColor,
    );
    setTranslucent(
      options.translucent !== undefined ? options.translucent : translucent,
    );
  };

  return (
    <StatusBarContext.Provider
      value={{barStyle, backgroundColor, translucent, setStatusBar}}>
      <RNStatusBar
        barStyle={barStyle}
        backgroundColor="blue"
        translucent={translucent}
      />
      {children}
    </StatusBarContext.Provider>
  );
};

export const useStatusBar = () => {
  const context = useContext(StatusBarContext);
  if (!context) {
    throw new Error('useStatusBar must be used within a StatusBarProvider');
  }
  return context;
};
