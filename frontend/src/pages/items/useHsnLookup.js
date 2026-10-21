import { useEffect, useState } from 'react'
import { extractHsnResults } from './utils'

export default function useHsnLookup({ isEditOpen, hsnCode, isDropdownOpen }) {
  const [hsnOptions, setHsnOptions] = useState([])
  const [isHsnLoading, setIsHsnLoading] = useState(false)
  const [hsnLookupError, setHsnLookupError] = useState('')

  useEffect(() => {
    if (!isEditOpen || !isDropdownOpen) {
      setIsHsnLoading(false)
      if (!isEditOpen) {
        setHsnOptions([])
        setHsnLookupError('')
      }
      return undefined
    }

    const inputText = String(hsnCode || '').trim()
    if (inputText.length < 3) {
      setHsnOptions([])
      setIsHsnLoading(false)
      setHsnLookupError('')
      return undefined
    }

    const controller = new AbortController()
    setIsHsnLoading(true)
    setHsnLookupError('')

    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          inputText,
          selectedType: 'byCode',
          category: 'null',
        })
        const response = await fetch(
          `https://services.gst.gov.in/commonservices/hsn/search/qsearch?${params.toString()}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`HSN lookup failed: ${response.status}`)
        }

        setHsnOptions(extractHsnResults(await response.json()))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('HSN API error:', error)
          setHsnOptions([])
          setHsnLookupError(
            'Unable to load HSN suggestions. You can enter the code manually.',
          )
        }
      } finally {
        if (!controller.signal.aborted) setIsHsnLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [hsnCode, isEditOpen, isDropdownOpen])

  return {
    hsnOptions,
    setHsnOptions,
    isHsnLoading,
    hsnLookupError,
    setHsnLookupError,
  }
}
