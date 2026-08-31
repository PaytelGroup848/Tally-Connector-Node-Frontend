import { useState } from 'react'
import TallyContext from './context'

export function TallyProvider({ children }) {
  const [connected, setConnected] = useState(false)
  return <TallyContext.Provider value={{ connected, setConnected }}>{children}</TallyContext.Provider>
}