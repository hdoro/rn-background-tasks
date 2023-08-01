import * as SQLite from 'expo-sqlite'

function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        }
      },
    }
  }

  const db = SQLite.openDatabase('db.db')
  return db
}

export const db = openDatabase()

// Quick, dirty way to set the schema. Throw-away code
let mounted = false

if (!mounted) {
  db.transaction((tx) => {
    tx.executeSql(
      'create table if not exists items (id integer primary key not null, createdAt text);',
    )
  })
  mounted = true
}
