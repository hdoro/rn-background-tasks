import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import addItem from './addItem'
import useBackgroundTasks from './useBackgroundTasks'
import useQuery from './useQuery'
import useNotifications from './useNotifications'

const STATUS_LABELS = {
  [-1]: 'PENDING',
  0: 'RESTRICTED',
  1: 'DENIED',
  2: 'AVAILABLE',
}

export default function App() {
  const items = useQuery('select * from items order by id desc', [])
  const { status, enabled } = useBackgroundTasks()
  const { notification, expoPushToken, schedulePushNotification } =
    useNotifications()

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{ fontSize: 30 }}>Feed items</Text>

        <Text>
          Background tasks: {enabled ? 'enabled' : 'disabled'}. Status:{' '}
          {STATUS_LABELS[status]}
        </Text>
        <Text>Your expo push token: {expoPushToken}</Text>
        {notification && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification.request.content.title} </Text>
            <Text>Body: {notification.request.content.body}</Text>
            <Text>
              Data: {JSON.stringify(notification.request.content.data)}
            </Text>
          </View>
        )}

        <StatusBar style="auto" />
        <View style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Button
            onPress={schedulePushNotification}
            title="Schedule notification"
          />
          <Button onPress={() => addItem('manual')} title="Manually add" />
        </View>
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
