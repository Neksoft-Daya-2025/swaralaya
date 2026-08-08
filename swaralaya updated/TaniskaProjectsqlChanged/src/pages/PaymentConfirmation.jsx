import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchBooking } from '../services/eventBookingApi'

function formatAmount(amount) {
  const value = Number(amount)
  if (Number.isNaN(value)) return '—'
  return `€${value.toFixed(2)}`
}

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId') || ''
  const outcome = (searchParams.get('outcome') || 'success').toLowerCase()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(Boolean(bookingId))
  const [fetchError, setFetchError] = useState('')

  const isSuccess = outcome === 'success' || outcome === 'paid' || outcome === 'confirmed'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setFetchError('')
      try {
        const data = await fetchBooking(bookingId)
        if (!cancelled) setBooking(data)
      } catch (error) {
        if (!cancelled) {
          setFetchError(error.message || 'Could not load booking details.')
          setBooking(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [bookingId])

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #f7f5f3 0%, #efeae6 100%)',
        minHeight: '70vh',
        padding: '80px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #eae6e2',
          boxShadow: '0 12px 40px rgba(111, 53, 39, 0.08)',
          padding: '48px 36px',
          textAlign: 'center',
        }}
      >
        {isSuccess ? (
          <>
            <div
              aria-hidden="true"
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'rgba(46, 125, 50, 0.12)',
                color: '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              ✓
            </div>
            <h1
              style={{
                margin: '0 0 12px',
                color: 'var(--brown)',
                fontFamily: 'var(--font-slab)',
                fontSize: 'clamp(26px, 4vw, 32px)',
              }}
            >
              Payment Successful
            </h1>
            <p style={{ margin: '0 0 8px', color: '#555', fontSize: '16px', lineHeight: 1.6 }}>
              Thank you for booking with Swaralaya.
            </p>
            <p style={{ margin: '0 0 28px', color: '#777', fontSize: '15px', lineHeight: 1.6 }}>
              Your booking has been confirmed.
            </p>
          </>
        ) : (
          <>
            <h1
              style={{
                margin: '0 0 12px',
                color: 'var(--brown)',
                fontFamily: 'var(--font-slab)',
                fontSize: 'clamp(26px, 4vw, 32px)',
              }}
            >
              {outcome === 'cancelled'
                ? 'Payment Cancelled'
                : outcome === 'failed'
                  ? 'Payment Failed'
                  : outcome === 'pending'
                    ? 'Payment Pending'
                    : 'Payment Status'}
            </h1>
            <p style={{ margin: '0 0 28px', color: '#777', fontSize: '15px', lineHeight: 1.6 }}>
              {outcome === 'cancelled'
                ? 'Your payment was cancelled. No charge was completed.'
                : outcome === 'failed'
                  ? 'We could not complete your payment. Please try booking again.'
                  : outcome === 'pending'
                    ? 'Your payment is still being processed. You will receive a confirmation email when it completes.'
                    : 'We could not verify your payment status. If you were charged, please contact us with your booking details.'}
            </p>
          </>
        )}

        {bookingId && (
          <div
            style={{
              textAlign: 'left',
              background: '#faf8f6',
              border: '1px solid #ebe5e0',
              borderRadius: '12px',
              padding: '20px 22px',
              marginBottom: '28px',
            }}
          >
            {loading ? (
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Loading booking details…</p>
            ) : fetchError ? (
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{fetchError}</p>
            ) : booking ? (
              <dl style={{ margin: 0, display: 'grid', gap: '14px' }}>
                <DetailRow
                  label="Event Name"
                  value={booking.event?.title || '—'}
                />
                <DetailRow
                  label="Booking ID"
                  value={booking.bookingReference || booking.id}
                />
                <DetailRow
                  label="Primary Contact"
                  value={
                    <>
                      <span style={{ display: 'block' }}>{booking.customerName}</span>
                      <span style={{ display: 'block', color: '#777', fontSize: '13px' }}>
                        {booking.customerEmail}
                      </span>
                    </>
                  }
                />
                <DetailRow label="Quantity" value={String(booking.quantity ?? '—')} />
                <DetailRow label="Amount Paid" value={formatAmount(booking.totalAmount)} />
              </dl>
            ) : null}
          </div>
        )}

        <Link to="/" className="theme-btn theme-btn-dark">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: '12px',
        alignItems: 'start',
      }}
    >
      <dt
        style={{
          margin: 0,
          color: '#888',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          color: 'var(--brown)',
          fontSize: '15px',
          fontWeight: 600,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </dd>
    </div>
  )
}
