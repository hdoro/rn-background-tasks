import { db } from './db'

export default function addItem(createdBy) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'insert into items (createdAt, createdByEvent) values (?, ?)',
          [new Date().toISOString(), createdBy ?? null],
        )
        tx.executeSql(
          'select * from items order by id desc limit 1',
          [],
          (_, { rows }) => console.log(JSON.stringify(rows)),
        )
      },
      reject,
      resolve,
    )
  })
}
