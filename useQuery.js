import { useEffect, useState } from 'react'
import { db } from './db'

/**
 *
 * @param {string} query
 * @param {(number | string | null)[]} params
 * @returns {any[]}
 */
export default function useQuery(query, params) {
  const [result, setResult] = useState(null)

  function runQuery(q, p) {
    db.transaction((tx) => {
      tx.executeSql(q, p, (_, { rows: { _array } }) => setResult(_array))
    })
  }

  useEffect(() => {
    if (!params || !query) return

    runQuery(query, params)
    const interval = setInterval(() => runQuery(query, params), 1000)

    return () => clearInterval(interval)
  }, [params, query])

  return result
}
