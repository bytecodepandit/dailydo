import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, ProgressBar, Text} from 'react-native-paper';

interface DatabaseLoadingScreenProps {
  message?: string;
}

const DatabaseLoadingScreen: React.FC<DatabaseLoadingScreenProps> = ({
  message = 'Initializing database...',
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    'Connecting to database...',
  );
  const [stageIndex, setStageIndex] = useState(0);

  const stages = useCallback(
    () => [
      'Connecting to database...',
      'Preparing database...',
      'Checking database schema...',
      'Setting up tables...',
      'Finishing initialization...',
    ],
    [],
  );

  useEffect(() => {
    const currentStages = stages();
    let intervalId: NodeJS.Timeout | null = null;

    if (stageIndex < currentStages.length) {
      intervalId = setInterval(() => {
        setStatusMessage(currentStages[stageIndex]);
        setProgress((stageIndex + 1) / currentStages.length);
        setStageIndex(prevIndex => prevIndex + 1);
      }, 800);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [stageIndex, stages]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.statusMessage}>{statusMessage}</Text>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          progress={progress}
          color="#2196F3"
          style={styles.progressBar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusMessage: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '80%',
    marginTop: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default DatabaseLoadingScreen;
