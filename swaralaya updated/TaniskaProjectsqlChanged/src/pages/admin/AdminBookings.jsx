import { useCallback, useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3001/api'
const PAGE_SIZE = 15

const PAYMENT_STATUS_OPTIONS = [
  '',
  'pending',
  'paid',
  'free',
  'cancelled',
  'failed',
  'expired',
]

const BOOKING_STATUS_OPTIONS = ['', 'pending', 'paid', 'confirmed', 'cancelled']

function authHeaders() {
  const token = localStorage.getItem('adminToken')
  return { Authorization: `Bearer ${token}` }
}

function parseApiError(data, fallback) {
  const message = data?.message
  if (Array.isArray(message)) return message.join(', ')
  if (typeof message === 'string' && message.trim()) return message
  return fallback
}

function formatMoney(amount) {
  const value = Number(amount)
  if (Number.isNaN(value)) return '—'
  return `€${value.toFixed(2)}`
}

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(value)
  }
}

function statusBadgeStyle(status) {
  const key = String(status || '').toLowerCase()
  if (key === 'paid' || key === 'confirmed' || key === 'free') {
    return { background: '#e8f5e9', color: '#2e7d32' }
  }
  if (key === 'cancelled' || key === 'failed' || key === 'expired') {
    return { background: '#ffebee', color: '#c62828' }
  }
  return { background: '#fff3e0', color: '#e65100' }
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'capitalize',
        ...statusBadgeStyle(status),
      }}
    >
      {status || '—'}
    </span>
  )
}

function isPaidForEmail(booking) {
  const payment = String(booking.paymentStatus || '').toLowerCase()
  const status = String(booking.status || '').toLowerCase()
  return (
    payment === 'paid' ||
    payment === 'free' ||
    status === 'paid' ||
    status === 'confirmed'
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    eventId: '',
    paymentStatus: '',
    status: '',
    date: '',
    search: '',
  })
  const [searchInput, setSearchInput] = useState('')

  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const loadEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/events?all=true`, {
        headers: authHeaders(),
      })
      if (response.ok) {
        setEvents(await response.json())
      }
    } catch (err) {
      console.error('Could not load events for filter:', err)
    }
  }, [])

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PAGE_SIZE))
      if (filters.eventId) params.set('eventId', filters.eventId)
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
      if (filters.status) params.set('status', filters.status)
      if (filters.date) params.set('date', filters.date)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load bookings.')
      }

      const payload = await response.json()
      setBookings(payload.data || [])
      setTotal(payload.total || 0)
      setTotalPages(payload.totalPages || 1)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const updateFilter = (key, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applySearch = (event) => {
    event.preventDefault()
    setPage(1)
    setFilters((prev) => ({ ...prev, search: searchInput.trim() }))
  }

  const clearFilters = () => {
    setSearchInput('')
    setPage(1)
    setFilters({
      eventId: '',
      paymentStatus: '',
      status: '',
      date: '',
      search: '',
    })
  }

  const openView = async (booking) => {
    setActionMessage('')
    setActionError('')
    setSelected(booking)
    setShowModal(true)

    try {
      const response = await fetch(`${API_BASE}/bookings/${booking.id}`, {
        headers: authHeaders(),
      })
      if (response.ok) {
        setSelected(await response.json())
      }
    } catch (err) {
      console.error('Could not refresh booking details:', err)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelected(null)
    setActionMessage('')
    setActionError('')
  }

  const resendEmail = async (booking) => {
    if (!isPaidForEmail(booking)) return
    setActionLoading('resend')
    setActionMessage('')
    setActionError('')
    try {
      const response = await fetch(
        `${API_BASE}/bookings/${booking.id}/resend-confirmation`,
        {
          method: 'POST',
          headers: authHeaders(),
        },
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          parseApiError(data, 'Failed to resend confirmation email.'),
        )
      }
      setActionMessage('Confirmation email sent successfully.')
      setSelected(data)
      loadBookings()
    } catch (err) {
      setActionError(err.message || 'Failed to resend confirmation email.')
    } finally {
      setActionLoading('')
    }
  }

  const cancelBooking = async (booking) => {
    const confirmed = window.confirm(
      `Cancel booking ${booking.bookingReference}? Ticket capacity will be released.`,
    )
    if (!confirmed) return

    setActionLoading('cancel')
    setActionMessage('')
    setActionError('')
    try {
      const response = await fetch(`${API_BASE}/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: authHeaders(),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(parseApiError(data, 'Failed to cancel booking.'))
      }
      setActionMessage('Booking cancelled and capacity released.')
      setSelected(data)
      loadBookings()
    } catch (err) {
      setActionError(err.message || 'Failed to cancel booking.')
    } finally {
      setActionLoading('')
    }
  }

  const filterSelectStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #eae6e2',
    background: '#fff',
    fontSize: '13.5px',
    color: '#444',
    minWidth: '150px',
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--brown)',
            margin: '0 0 8px',
          }}
        >
          Manage Bookings
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
          View event ticket bookings, payment status, and attendees. Resend
          confirmation emails or cancel bookings when needed.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #eae6e2',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          display: 'grid',
          gap: '14px',
        }}
      >
        <form
          onSubmit={applySearch}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search booking ID, name, or email…"
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #eae6e2',
              fontSize: '13.5px',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--brown)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            style={{
              background: '#fcfcfc',
              color: '#666',
              border: '1px solid #eae6e2',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Clear
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <select
            value={filters.eventId}
            onChange={(e) => updateFilter('eventId', e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => updateFilter('paymentStatus', e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">All Payment Statuses</option>
            {PAYMENT_STATUS_OPTIONS.filter(Boolean).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">All Booking Statuses</option>
            {BOOKING_STATUS_OPTIONS.filter(Boolean).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => updateFilter('date', e.target.value)}
            style={filterSelectStyle}
            title="Filter by booking date"
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #eae6e2',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            Loading bookings…
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#c62828' }}>
            {error}
            <div style={{ marginTop: '12px' }}>
              <button
                type="button"
                onClick={loadBookings}
                style={{
                  background: 'var(--brown)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13.5px',
                minWidth: '980px',
              }}
            >
              <thead>
                <tr style={{ background: '#fcfbfa', borderBottom: '1px solid #eae6e2' }}>
                  {[
                    'Booking ID',
                    'Event Name',
                    'Primary Contact',
                    'Email',
                    'Tickets',
                    'Amount',
                    'Payment Status',
                    'Booking Status',
                    'Booking Date',
                    'Actions',
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: '14px 16px',
                        fontWeight: 700,
                        color: '#555',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: '40px 16px',
                        textAlign: 'center',
                        color: '#888',
                      }}
                    >
                      No bookings found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: '1px solid #eae6e2' }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#333' }}>
                        {booking.bookingReference || booking.id}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#444', maxWidth: '180px' }}>
                        {booking.event?.title || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#333' }}>
                        {booking.customerName}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <a
                          href={`mailto:${booking.customerEmail}`}
                          style={{ color: 'var(--brown)', textDecoration: 'none' }}
                        >
                          {booking.customerEmail}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{booking.quantity}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        {formatMoney(booking.totalAmount)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={booking.paymentStatus} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td style={{ padding: '14px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                        {formatDateTime(booking.createdAt)}
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => openView(booking)}
                          style={{
                            background: 'var(--brown)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && total > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderTop: '1px solid #eae6e2',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '13px', color: '#777' }}>
              Showing page {page} of {totalPages} · {total} booking
              {total === 1 ? '' : 's'}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #eae6e2',
                  background: page <= 1 ? '#f5f5f5' : '#fff',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #eae6e2',
                  background: page >= totalPages ? '#f5f5f5' : '#fff',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selected && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #eae6e2',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '24px 24px 0',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: 'var(--brown)',
                    fontSize: '22px',
                    fontWeight: 800,
                  }}
                >
                  Booking Details
                </h2>
                <p style={{ margin: '6px 0 0', color: '#888', fontSize: '13px' }}>
                  {selected.bookingReference}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                style={{
                  border: 'none',
                  background: '#f5f3f1',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '20px 24px 24px', display: 'grid', gap: '22px' }}>
              {(actionMessage || actionError) && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: actionError ? '#ffebee' : '#e8f5e9',
                    color: actionError ? '#c62828' : '#2e7d32',
                    fontSize: '13.5px',
                    fontWeight: 600,
                  }}
                >
                  {actionError || actionMessage}
                </div>
              )}

              <DetailSection title="Booking Information">
                <DetailRow label="Booking ID" value={selected.bookingReference || selected.id} />
                <DetailRow label="Booking Date" value={formatDateTime(selected.createdAt)} />
                <DetailRow label="Event" value={selected.event?.title || '—'} />
                <DetailRow label="Quantity" value={String(selected.quantity ?? '—')} />
                <DetailRow label="Total Amount" value={formatMoney(selected.totalAmount)} />
              </DetailSection>

              <DetailSection title="Primary Contact">
                <DetailRow label="Name" value={selected.customerName} />
                <DetailRow label="Email" value={selected.customerEmail} />
                <DetailRow label="Phone" value={selected.customerPhone || '—'} />
              </DetailSection>

              <DetailSection title="Attendees">
                {Array.isArray(selected.attendees) && selected.attendees.length > 0 ? (
                  selected.attendees.map((attendee, index) => (
                    <div
                      key={`${attendee.email || attendee.name}-${index}`}
                      style={{
                        border: '1px solid #ebe5e0',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        marginBottom: index === selected.attendees.length - 1 ? 0 : '10px',
                        background: '#faf8f6',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: '#555',
                          marginBottom: '8px',
                          fontSize: '13px',
                        }}
                      >
                        {index + 1}.
                      </div>
                      <DetailRow label="Name" value={attendee.name || '—'} />
                      <DetailRow label="Email" value={attendee.email || '—'} />
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: '#888', fontSize: '13.5px' }}>
                    No attendee details recorded.
                  </p>
                )}
              </DetailSection>

              <DetailSection title="Payment">
                <DetailRow
                  label="Payment Status"
                  value={<StatusBadge status={selected.paymentStatus} />}
                />
                <DetailRow
                  label="Booking Status"
                  value={<StatusBadge status={selected.status} />}
                />
                <DetailRow
                  label="Mollie Payment ID"
                  value={selected.molliePaymentId || '—'}
                />
                <DetailRow
                  label="Confirmation Email Sent"
                  value={selected.confirmationEmailSent ? 'Yes' : 'No'}
                />
                <DetailRow label="Created At" value={formatDateTime(selected.createdAt)} />
                <DetailRow label="Updated At" value={formatDateTime(selected.updatedAt)} />
              </DetailSection>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid #eae6e2',
                  paddingTop: '16px',
                }}
              >
                {isPaidForEmail(selected) && (
                  <button
                    type="button"
                    disabled={actionLoading === 'resend'}
                    onClick={() => resendEmail(selected)}
                    style={{
                      background: '#fff',
                      color: 'var(--brown)',
                      border: '1px solid var(--brown)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontWeight: 700,
                      cursor: actionLoading === 'resend' ? 'wait' : 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {actionLoading === 'resend'
                      ? 'Sending…'
                      : 'Resend Confirmation Email'}
                  </button>
                )}

                {String(selected.status).toLowerCase() !== 'cancelled' && (
                  <button
                    type="button"
                    disabled={actionLoading === 'cancel'}
                    onClick={() => cancelBooking(selected)}
                    style={{
                      background: '#ffebee',
                      color: '#c62828',
                      border: '1px solid #ffcdd2',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontWeight: 700,
                      cursor: actionLoading === 'cancel' ? 'wait' : 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {actionLoading === 'cancel' ? 'Cancelling…' : 'Cancel Booking'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: 'var(--brown)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <section>
      <h3
        style={{
          margin: '0 0 12px',
          fontSize: '15px',
          fontWeight: 800,
          color: 'var(--brown)',
          borderBottom: '1px solid #ebe5e0',
          paddingBottom: '8px',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'grid', gap: '8px' }}>{children}</div>
    </section>
  )
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: '10px',
        alignItems: 'start',
        fontSize: '13.5px',
      }}
    >
      <div style={{ color: '#888', fontWeight: 600 }}>{label}</div>
      <div style={{ color: '#333', fontWeight: 600, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  )
}
