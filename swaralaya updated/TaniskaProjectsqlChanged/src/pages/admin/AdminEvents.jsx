import { useEffect, useState } from 'react'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [eventId, setEventId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [registrationLink, setRegistrationLink] = useState('')
  const [ticketPrice, setTicketPrice] = useState('0')
  const [ticketCapacity, setTicketCapacity] = useState('0')
  const [published, setPublished] = useState(true)
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchAllEvents()
  }, [])

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:3001/api/events?all=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditingEvent = (event) => {
    setEventId(event.id)
    setTitle(event.title)
    setDescription(event.description || '')
    setDate(event.date || '')
    setTime(event.time || '')
    setLocation(event.location || '')
    setRegistrationLink(event.registrationLink || '')
    setTicketPrice(String(event.ticketPrice ?? 0))
    setTicketCapacity(String(event.ticketCapacity ?? 0))
    setPublished(event.published)
    setImageFile(null)
    setIsEditing(true)
  }

  const startCreatingNewEvent = () => {
    setEventId(null)
    setTitle('')
    setDescription('')
    setDate('')
    setTime('')
    setLocation('')
    setRegistrationLink('')
    setTicketPrice('0')
    setTicketCapacity('0')
    setPublished(true)
    setImageFile(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  const deleteEvent = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this event? This cannot be undone.')
    if (!confirmed) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setEvents((currentEvents) => currentEvents.filter((ev) => ev.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  const submitEventForm = async (event) => {
    event.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('date', date)
    formData.append('time', time)
    formData.append('location', location)
    formData.append('registrationLink', registrationLink)
    formData.append('ticketPrice', ticketPrice)
    formData.append('ticketCapacity', ticketCapacity)
    formData.append('published', String(published))

    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const token = localStorage.getItem('adminToken')
      const requestUrl = eventId
        ? `http://localhost:3001/api/events/${eventId}`
        : 'http://localhost:3001/api/events'
      const requestMethod = eventId ? 'PUT' : 'POST'

      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setIsEditing(false)
        fetchAllEvents()
      } else {
        alert('Failed to save the event. Please check the fields and try again.')
      }
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ color: '#666', padding: '20px' }}>Loading events... please wait.</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
            Manage Events
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            Create and manage events displayed on the public events page.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={startCreatingNewEvent}
            style={{
              background: 'var(--brown)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-plus"></i> Add Event
          </button>
        )}
      </div>

      {isEditing ? (
        // =============================================
        // EDITING FORM — Create or Edit an event
        // =============================================
        <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--brown)', marginTop: 0, marginBottom: '24px' }}>
            {eventId ? 'Edit Event' : 'Add New Event'}
          </h2>

          <form onSubmit={submitEventForm}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Event Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the event details..."
                    rows={6}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Ticket price and capacity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                      Ticket Price (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                      Ticket Capacity *
                    </label>
                    <input
                      type="number"
                      min={events.find((event) => event.id === eventId)?.ticketsSold || 0}
                      step="1"
                      required
                      value={ticketCapacity}
                      onChange={(e) => setTicketCapacity(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Swaralaya Hall, Amsterdam"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Registration Link */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Registration Link (optional)
                  </label>
                  <input
                    type="url"
                    value={registrationLink}
                    onChange={(e) => setRegistrationLink(e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Event Image */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Event Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{ fontSize: '14px' }}
                  />
                  <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0' }}>
                    Upload a banner/cover image for the event.
                  </p>
                </div>

                {/* Published Toggle */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Visibility
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#333' }}>Published (visible on site)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form action buttons */}
            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #eae6e2', paddingTop: '24px', marginTop: '32px', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: 'var(--brown)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.8 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : eventId ? 'Update Event' : 'Create Event'}
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                style={{
                  background: '#f5f5f5',
                  color: '#555',
                  border: '1px solid #eae6e2',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto'
                }}
              >
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
            </div>
          </form>
        </div>

      ) : (
        // ============================================
        // EVENTS LISTING TABLE
        // ============================================
        <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
            <thead>
              <tr style={{ background: '#fcfbfa', borderBottom: '1px solid #eae6e2' }}>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Image</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Title</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Location</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Ticket Price</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Capacity</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Sold</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Remaining</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                    No events created yet. Click "Add Event" to start.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #eae6e2' }}>
                    <td style={{ padding: '16px 24px' }}>
                      {event.image ? (
                        <img
                          src={`http://localhost:3001${event.image}`}
                          alt={event.title}
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '40px',
                          background: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          color: '#999',
                          borderRadius: '4px'
                        }}>
                          No Img
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '700', color: '#333' }}>
                      {event.title}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#666' }}>
                      {event.date ? new Date(event.date).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#666' }}>
                      {event.location || '-'}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#666', whiteSpace: 'nowrap' }}>
                      €{Number(event.ticketPrice || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#666' }}>
                      {Number(event.ticketCapacity) || 0}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#666' }}>
                      {Number(event.ticketsSold) || 0}
                    </td>
                    <td style={{ padding: '16px 24px', color: Number(event.ticketsRemaining) === 0 ? '#d32f2f' : '#2e7d32', fontWeight: '700' }}>
                      {Number(event.ticketsRemaining) || 0}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        background: event.published ? '#e8f5e9' : '#eceff1',
                        color: event.published ? '#2e7d32' : '#455a64',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => startEditingEvent(event)}
                        style={{ background: 'none', border: 'none', color: '#0288d1', cursor: 'pointer', fontWeight: '700', marginRight: '16px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}