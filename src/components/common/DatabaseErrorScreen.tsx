import React, {useCallback} from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Card, List, Text} from 'react-native-paper';

interface DatabaseErrorScreenProps {
  error: Error | null;
  retry: () => void;
}

const DatabaseErrorScreen: React.FC<DatabaseErrorScreenProps> = ({
  error,
  retry,
}) => {
  // Function to clear app storage
  const handleClearStorage = useCallback(async () => {
    Alert.alert(
      'Clear Application Data?',
      'This will reset the application and clear all local data. You will need to log in again. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          onPress: async () => {
            try {
              if (Platform.OS === 'android') {
                Alert.alert(
                  'Manual Action Required',
                  'Please go to Settings > Apps > FinApp > Storage > Clear Data',
                  [
                    {text: 'Open Settings', onPress: openAppSettings},
                    {text: 'Cancel', style: 'cancel'},
                  ],
                );
              } else {
                // For iOS, we can try to programmatically delete the database
                Alert.alert('Data Cleared', 'Please restart the application.');
                // In a real iOS scenario, you might attempt to delete the database file:
                // const dbPath = `${RNFS.LibraryDirectoryPath}/LocalDatabase/finapp.db`;
                // await RNFS.unlink(dbPath);
              }
            } catch (e) {
              console.error('Failed to clear data:', e);
              Alert.alert(
                'Error Clearing Data',
                'Please manually clear app data through device settings.',
              );
            }
          },
          style: 'destructive',
        },
      ],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open app settings
  const openAppSettings = useCallback(() => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Database Error"
          subtitle="SQLite Initialization Failed"
        />
        <Card.Content>
          <Text style={styles.errorTitle}>
            The application couldn't initialize the database.
          </Text>

          <Text style={styles.errorMessage}>
            {error?.message || 'Unknown database error occurred.'}
          </Text>

          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.detailsText}>
              {error?.stack || 'No additional details available.'}
            </Text>
          </ScrollView>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Database Information:</Text>
            <Text style={styles.infoText}>Name: finapp.db</Text>
            <Text style={styles.infoText}>
              Location:{' '}
              {Platform.OS === 'android'
                ? '/data/data/com.finexapp/databases/'
                : 'App Documents Directory'}
            </Text>
            <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
          </View>

          <List.Section title="Recovery Options">
            <List.Item
              title="Retry Connection"
              description="Try to connect to the database again"
              left={props => <List.Icon {...props} icon="refresh" />}
              onPress={retry}
            />
            <List.Item
              title="Clear App Data"
              description="Reset the application (Caution: will delete local data)"
              left={props => <List.Icon {...props} icon="delete" />}
              onPress={handleClearStorage}
            />
            {Platform.OS === 'android' && (
              <List.Item
                title="App Settings"
                description="Go to Android app settings to clear storage"
                left={props => <List.Icon {...props} icon="cog" />}
                onPress={openAppSettings}
              />
            )}
          </List.Section>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button mode="contained" onPress={retry} style={styles.button}>
            Retry Connection
          </Button>
          <Button
            mode="outlined"
            onPress={handleClearStorage}
            style={styles.button}>
            Clear Data
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    marginBottom: 16,
    color: '#d32f2f',
  },
  detailsContainer: {
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  infoContainer: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  cardActions: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DatabaseErrorScreen;
