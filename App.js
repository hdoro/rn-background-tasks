import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import addItem from './addItem'
import useQuery from './useQuery'

export default function App() {
  const items = useQuery('select * from items', [])
  return (
    <View style={styles.container}>
      <Text>Feed items</Text>
      <StatusBar style="auto" />
      <Button onPress={addItem} title="New item" />
      {items?.map((item) => (
        <View key={JSON.stringify(item)}>
          <Text>{JSON.stringify(item, null, 2)}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
