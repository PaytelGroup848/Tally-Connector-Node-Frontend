import { useContext } from 'react'
import TallyContext from '../context/context'

export default function useTally() {
  return useContext(TallyContext)
}
