import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import addItem from './addItem'
import useBackgroundTasks from './useBackgroundTasks'
import useQuery from './useQuery'

const STATUS_LABELS = {
  [-1]: 'PENDING',
  0: 'RESTRICTED',
  1: 'DENIED',
  2: 'AVAILABLE',
}

export default function App() {
  const items = useQuery('select * from items order by id desc', [])
  const { status, enabled } = useBackgroundTasks()

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>
          Feed items (update is {enabled ? 'enabled' : 'disabled'}. Status:{' '}
          {STATUS_LABELS[status]})
        </Text>
        <StatusBar style="auto" />

        <Button onPress={() => addItem('manual')} title="New item" />
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
