import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import BackgroundFetch from 'react-native-background-fetch'
import addItem from './addItem'
import useQuery from './useQuery'

const STATUS_LABELS = {
  [-1]: 'PENDING',
  0: 'RESTRICTED',
  1: 'DENIED',
  2: 'AVAILABLE',
}

export default function App() {
  const items = useQuery('select * from items order by id desc', [])
  const [status, setStatus] = React.useState(-1)
  const [enabled, setEnabled] = React.useState(false)

  React.useEffect(() => {
    initBackgroundFetch()
  }, [])

  const initBackgroundFetch = async () => {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async (taskId) => {
        console.log('[BackgroundFetch] taskId', taskId)
        await addItem(taskId)
        // Finish.
        BackgroundFetch.finish(taskId)
      },
      (taskId) => {
        // Oh No!  Our task took too long to complete and the OS has signalled
        // that this task must be finished immediately.
        console.log('[Fetch] TIMEOUT taskId:', taskId)
        BackgroundFetch.finish(taskId)
      },
    )
    setStatus(status)
    setEnabled(true)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>
          Feed items (update is {enabled ? 'enabled' : 'disabled'}. Status:{' '}
          {STATUS_LABELS[status]})
        </Text>
        <StatusBar style="auto" />
        <Button onPress={() => addItem()} title="New item" />
        {items?.map((item) => (
          <View key={JSON.stringify(item)}>
            <Text>{JSON.stringify(item, null, 2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
})
