import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://strapi-ccett.hungwevision.com/detections?_limit=-1');
      if (!response.ok) {
        throw new Error('Failed to fetch detection logs');
      }
      const data = await response.json();

      // Filter the logs where MotionDetected is true
      const filteredData = data.filter((log: any) => log.MotionDetected);

      // Sort the filtered logs from newest to oldest by the "Datetime" field
      const sortedData = filteredData.sort(
        (a: any, b: any) => new Date(b.Datetime).getTime() - new Date(a.Datetime).getTime()
      );
      setLogs(sortedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <ThemedText>Loading logs...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedText style={styles.headerImage}>Detection Logs</ThemedText>
      }>
      <ThemedView style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.flex2]}>Datetime</Text>
          <Text style={[styles.tableHeader, styles.flex1]}>Motion</Text>
          <Text style={[styles.tableHeader, styles.flex1]}>Human</Text>
        </View>

        {/* Table Rows */}
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flex2]}>
                {new Date(item.Datetime).toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, styles.flex1]}>
                {item.MotionDetected ? 'Yes' : 'No'}
              </Text>
              <Text style={[styles.tableCell, styles.flex1]}>
                {item.HumanDetected ? 'Yes' : 'No'}
              </Text>
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  headerImage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#808080',
  },
  tableContainer: {
    margin: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
