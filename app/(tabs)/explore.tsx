import React, { useEffect, useState } from 'react';

// This shows an error, but the code works as expected
import { StyleSheet, View, Text, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMotionLogs, setShowMotionLogs] = useState(false); // Add state for checkbox

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://strapi-ccett.hungwevision.com/detections?_limit=-1');
      if (!response.ok) {
        throw new Error('Failed to fetch detection logs');
      }
      const data = await response.json();

      // Filter logs: Always include HumanDetected true, and if checkbox is checked, include MotionDetected true and HumanDetected false
      const filteredData = data.filter((log: any) => {
        if (log.HumanDetected) return true;
        if (showMotionLogs && log.MotionDetected && !log.HumanDetected) return true;
        return false;
      });

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
  }, [showMotionLogs]); // Re-fetch when checkbox state changes

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

      {/* Checkbox for toggling motion logs */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          checked={showMotionLogs}
          onPress={() => setShowMotionLogs(!showMotionLogs)} // Toggle state when checkbox is clicked
        />
        <ThemedText>Also show logs where only Motion was detected</ThemedText>
      </View>

      <ScrollView style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.flex1]}>Datetime</Text>
          <Text style={[styles.tableHeader, styles.flex2]}>Detection Type</Text>
        </View>

        {/* FlatList for Displaying Logs */}
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flex1]}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, styles.flex2]}>
                {item.HumanDetected && item.MotionDetected
                  ? 'Human & Motion'
                  : item.HumanDetected
                  ? 'Human'
                  : 'Motion'}
              </Text>
            </View>
          )}
        />
      </ScrollView>
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
    textAlign: 'left',
    marginVertical: 16,
    color: '#808080',
    paddingLeft: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
    paddingLeft: 16,
  },
  tableContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#151718',
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
    color: '#fff',
    textAlign: 'left',
    paddingLeft: 16,
  },
  tableCell: {
    fontSize: 14,
    color: '#eee',
    textAlign: 'left',
    paddingLeft: 16,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
