import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3001/api/events'

/**
 * Loads published upcoming events from the public API.
 * Visibility of Home section / nav should follow hasUpcomingEvents.
 */
export function useUpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          if (!cancelled) setEvents([])
          return
        }

        const data = await response.json()
        const list = Array.isArray(data) ? data : []
        if (!cancelled) {
          setEvents(list)
        }
      } catch (error) {
        console.warn('Backend events API not reachable.', error)
        if (!cancelled) setEvents([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    events,
    loading,
    hasUpcomingEvents: !loading && events.length > 0,
  }
}
