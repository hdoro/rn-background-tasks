import React from 'react'
import BackgroundFetch from 'react-native-background-fetch'
import addItem from './addItem'

export default function useBackgroundTasks() {
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
        requiresStorageNotLow: false, // Default`
      },
      async (taskId) => {
        console.log('[BackgroundFetch] taskId', taskId)
        // HERE'S WHERE WE'D DIFFERENTIATE BETWEEN TASKS
        // For now, they'll have a different `createdByEvent` in SQLite.
        await addItem(taskId ?? 'background-fetch')
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
    const startStatus = await BackgroundFetch.start()
    setStatus(startStatus)
    setEnabled(true)
  }

  return {
    status,
    enabled,
  }
}
