import { db } from './db'

export default function addItem() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('insert into items (createdAt) values (?)', [
          new Date().toISOString(),
        ])
        tx.executeSql('select * from items', [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
        )
      },
      reject,
      resolve,
    )
  })
}
