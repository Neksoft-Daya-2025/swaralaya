const API_BASE = 'http://localhost:3001/api'

async function parseError(response) {
  const data = await response.json().catch(() => ({}))
  const message = data.message

  if (Array.isArray(message)) {
    return message.join(', ')
  }
  if (typeof message === 'string') {
    return message
  }

  return data.error || `Request failed (${response.status})`
}

export async function createBooking(data) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: data.eventId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.phone || data.customerPhone || undefined,
      quantity: data.quantity,
      attendees: data.attendees,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}

export async function fetchBooking(bookingId) {
  const response = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}`)

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}
