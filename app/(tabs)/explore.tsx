import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
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
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
    <ThemedView style={styles.container}>
      <ThemedText style={styles.headerImage}>Detection Logs</ThemedText>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.flex2]}>Datetime</Text>
          <Text style={[styles.tableHeader, styles.flex1]}>Motion</Text>
          <Text style={[styles.tableHeader, styles.flex1]}>Human</Text>
        </View>

        {/* FlatList for Displaying Logs */}
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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,  // Adjust if needed
    paddingHorizontal: 16,
  },
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
    marginTop: 16,
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
