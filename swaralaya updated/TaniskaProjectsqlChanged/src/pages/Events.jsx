import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { createBooking } from '../services/eventBookingApi'

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{breadcrumb}</span>
        </div>
      </div>
    </div>
  )
}

const emptyForm = {
  customerName: '',
  customerEmail: '',
  phone: '',
  quantity: 1,
  attendees: [{ name: '', email: '' }],
}

export default function Events() {
  const ref = useScrollAnimation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [bookingEvent, setBookingEvent] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/events')
        if (res.ok) {
          const data = await res.json()
          setEvents(data)
        }
      } catch (e) {
        console.warn('Backend events API not reachable.', e)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const closeModal = useCallback(() => {
    if (submitting) return
    setBookingEvent(null)
    setForm(emptyForm)
    setFormError('')
    setBookingSuccess(false)
  }, [submitting])

  useEffect(() => {
    if (!bookingEvent) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [bookingEvent, closeModal])

  const openBookingModal = (event) => {
    if (Number(event.ticketsRemaining) <= 0) return

    setBookingEvent(event)
    setForm({ ...emptyForm, attendees: [{ name: '', email: '' }] })
    setFormError('')
    setBookingSuccess(false)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      if (name !== 'quantity') {
        return { ...prev, [name]: value }
      }

      const maxQuantity = Math.max(1, Number(bookingEvent?.ticketsRemaining) || 1)
      const quantity = Math.min(
        maxQuantity,
        Math.max(1, parseInt(value, 10) || 1),
      )
      const attendees = Array.from(
        { length: quantity },
        (_, index) => prev.attendees[index] || { name: '', email: '' },
      )

      return { ...prev, quantity, attendees }
    })
  }

  const handleAttendeeChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      attendees: prev.attendees.map((attendee, attendeeIndex) =>
        attendeeIndex === index
          ? { ...attendee, [field]: value }
          : attendee,
      ),
    }))
  }

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    if (!bookingEvent) return

    setFormError('')
    setSubmitting(true)

    try {
      const result = await createBooking({
        eventId: bookingEvent.id,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        phone: form.phone.trim(),
        quantity: Number(form.quantity),
        attendees:
          Number(form.quantity) === 1
            ? [
                {
                  name: form.customerName.trim(),
                  email: form.customerEmail.trim(),
                },
              ]
            : form.attendees.map((attendee) => ({
                name: attendee.name.trim(),
                email: attendee.email.trim(),
              })),
      })

      if (result.paymentRequired && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
        return
      }

      setBookingSuccess(true)
      setEvents((current) =>
        current.map((event) =>
          event.id === bookingEvent.id
            ? {
                ...event,
                ticketsSold: Number(event.ticketsSold) + Number(form.quantity),
                ticketsRemaining: Math.max(
                  0,
                  Number(event.ticketsRemaining) - Number(form.quantity),
                ),
              }
            : event,
        ),
      )
    } catch (err) {
      setFormError(err.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageBanner title="Upcoming Event" breadcrumb="Upcoming Event" />

      <section
        ref={ref}
        style={{
          background: '#f7f5f3',
          padding: '80px 0',
          minHeight: '60vh',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '16px', padding: '40px' }}>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: 'var(--brown)', fontFamily: 'var(--font-slab)', marginBottom: '16px' }}>
                No Upcoming Events
              </h2>
              <p style={{ color: '#888', fontSize: '16px' }}>
                No upcoming events at the moment.<br />
                Please check back soon.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {events.map((event) => (
                <article
                  key={event.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                    border: '1px solid #eae6e2',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {event.image && (
                    <div
                      style={{
                        width: '100%',
                        height: '380px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                      }}
                    >
                      <img
                        src={`http://localhost:3001${event.image}`}
                        alt={event.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '0 8px' }}>
                    <h2
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'var(--brown)',
                        fontFamily: 'var(--font-slab)',
                        marginBottom: '16px',
                      }}
                    >
                      {event.title}
                    </h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '20px' }}>
                      {event.date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '15px' }}>
                          <i className="fa-solid fa-calendar-days" style={{ color: 'var(--brown)' }}></i>
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {event.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '15px' }}>
                          <i className="fa-solid fa-clock" style={{ color: 'var(--brown)' }}></i>
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '15px' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: 'var(--brown)' }}></i>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.7', marginBottom: '24px', whiteSpace: 'pre-line' }}>
                        {event.description}
                      </p>
                    )}

                    <div className="event-cta-row">
                      {(() => {
                        const capacity = Number(event.ticketCapacity) || 0
                        const remaining = Number(event.ticketsRemaining) || 0
                        const canBook = capacity > 0 && remaining > 0
                        const bookingsFull = capacity > 0 && remaining === 0

                        return (
                          <button
                            type="button"
                            className="theme-btn event-book-tickets-btn"
                            onClick={() => openBookingModal(event)}
                            disabled={!canBook}
                            style={{
                              background: canBook ? 'var(--brown)' : '#b8a9a3',
                              color: '#ffffff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '12px 28px',
                              borderRadius: '4px',
                              fontSize: '15px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: canBook ? 'pointer' : 'not-allowed',
                              transition: 'background 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (canBook) e.currentTarget.style.background = '#5c2b20'
                            }}
                            onMouseLeave={(e) => {
                              if (canBook) e.currentTarget.style.background = 'var(--brown)'
                            }}
                          >
                            <i
                              className={
                                !canBook
                                  ? 'fa-solid fa-clock'
                                  : 'fa-solid fa-ticket'
                              }
                            ></i>
                            {canBook
                              ? 'Book Tickets'
                              : bookingsFull
                                ? 'Bookings Full'
                                : 'Tickets Coming Soon'}
                          </button>
                        )
                      })()}

                      {event.registrationLink && (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn"
                          style={{
                            background: 'transparent',
                            color: 'var(--brown)',
                            border: '2px solid var(--brown)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 28px',
                            borderRadius: '4px',
                            fontSize: '15px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'background 0.3s ease, color 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--brown)'
                            e.currentTarget.style.color = '#ffffff'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--brown)'
                          }}
                        >
                          Register Now <i className="fa-solid fa-arrow-right"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {bookingEvent && (
        <div
          className="event-booking-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="event-booking-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-booking-title"
          >
            <div className="event-booking-modal-header">
              <div>
                <h3 id="event-booking-title">Book Tickets</h3>
                <p style={{ margin: '6px 0 0', color: '#666', fontSize: '14px' }}>{bookingEvent.title}</p>
              </div>
              <button
                type="button"
                className="event-booking-modal-close"
                onClick={closeModal}
                disabled={submitting}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="event-booking-modal-body">
              {bookingSuccess ? (
                <>
                  <div className="event-booking-success">
                    <i className="fa-solid fa-circle-check" style={{ marginTop: '2px' }}></i>
                    <div>
                      <strong>Booking Successful!</strong>
                      <p style={{ margin: '6px 0 0', lineHeight: 1.5 }}>
                        Your booking has been confirmed. A confirmation email will be sent to{' '}
                        <strong>{form.customerEmail}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="theme-btn"
                    onClick={closeModal}
                    style={{
                      background: 'var(--brown)',
                      color: '#fff',
                      padding: '12px 24px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <form onSubmit={handleBookSubmit}>
                  {formError && (
                    <div className="event-booking-error" role="alert">
                      {formError}
                    </div>
                  )}

                  <div className="event-booking-section-heading">
                    <h4>Primary Contact</h4>
                    <p>Booking updates and confirmation will be sent here.</p>
                  </div>

                  <div className="event-booking-field">
                    <label htmlFor="customerName">Full Name *</label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                      disabled={submitting}
                    />
                  </div>

                  <div className="event-booking-field">
                    <label htmlFor="customerEmail">Email *</label>
                    <input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      required
                      value={form.customerEmail}
                      onChange={handleFormChange}
                      placeholder="you@example.com"
                      disabled={submitting}
                    />
                  </div>

                  <div className="event-booking-field">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="+31 6 12345678"
                      disabled={submitting}
                    />
                  </div>

                  <div className="event-booking-field">
                    <label>Ticket</label>
                    <div className="event-booking-ticket-summary">
                      Event Ticket — €{Number(bookingEvent.ticketPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="event-booking-field">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max={bookingEvent.ticketsRemaining}
                      required
                      value={form.quantity}
                      onChange={handleFormChange}
                      disabled={submitting}
                    />
                    <small>
                      {bookingEvent.ticketsRemaining} ticket
                      {Number(bookingEvent.ticketsRemaining) === 1 ? '' : 's'} remaining
                    </small>
                  </div>

                  {Number(form.quantity) > 1 && (
                    <div className="event-booking-attendees">
                      <h4>Passenger / Attendee Details</h4>
                      {form.attendees.map((attendee, index) => (
                        <div className="event-booking-attendee" key={index}>
                          <h5>Passenger / Attendee {index + 1}</h5>
                          <div className="event-booking-field">
                            <label htmlFor={`attendee-name-${index}`}>
                              Full Name *
                            </label>
                            <input
                              id={`attendee-name-${index}`}
                              type="text"
                              required
                              value={attendee.name}
                              onChange={(event) =>
                                handleAttendeeChange(
                                  index,
                                  'name',
                                  event.target.value,
                                )
                              }
                              placeholder="Full name"
                              disabled={submitting}
                            />
                          </div>
                          <div className="event-booking-field">
                            <label htmlFor={`attendee-email-${index}`}>
                              Email *
                            </label>
                            <input
                              id={`attendee-email-${index}`}
                              type="email"
                              required
                              value={attendee.email}
                              onChange={(event) =>
                                handleAttendeeChange(
                                  index,
                                  'email',
                                  event.target.value,
                                )
                              }
                              placeholder="attendee@example.com"
                              disabled={submitting}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    Total: <strong style={{ color: 'var(--brown)' }}>
                      €{(Number(bookingEvent.ticketPrice) * Number(form.quantity)).toFixed(2)}
                    </strong>
                  </p>

                  <div className="event-booking-actions">
                    <button
                      type="submit"
                      className="theme-btn"
                      disabled={submitting}
                      style={{
                        background: 'var(--brown)',
                        color: '#fff',
                        padding: '12px 28px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: submitting ? 'wait' : 'pointer',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        opacity: submitting ? 0.7 : 1,
                      }}
                    >
                      {submitting && <span className="event-booking-spinner"></span>}
                      {submitting ? 'Booking...' : 'Book'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ccc',
                        color: '#555',
                        padding: '12px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
