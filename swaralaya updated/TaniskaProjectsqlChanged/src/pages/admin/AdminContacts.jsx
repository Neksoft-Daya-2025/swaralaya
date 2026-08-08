import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

// This page shows all messages that students or visitors submitted through the Contact page.
// Admin can mark each message as "read" — which removes the unread badge from the sidebar.
export default function AdminContacts() {
  // List of all contact messages from the database
  const [contacts, setContacts] = useState([])

  // Show a loading message while fetching
  const [loading, setLoading] = useState(true)

  // fetchUnreadCount comes from the parent layout (AdminLayout.jsx)
  // Calling it updates the badge number in the sidebar navigation
  const { fetchUnreadCount } = useOutletContext()

  // Load contacts when the component first appears
  useEffect(() => {
    fetchAllContacts()
  }, [])

  // Fetch all contact messages from our NestJS backend
  const fetchAllContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch('http://localhost:3001/api/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Could not load contact messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark a specific message as read — updates the DB and the local state
  const markMessageAsRead = async (contactId) => {
    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch(`http://localhost:3001/api/contacts/${contactId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        // Update only this specific message in our list to show isRead: true
        setContacts((currentList) => {
          return currentList.map((contact) => {
            const contactItemId = contact._id || contact.id
            if (contactItemId === contactId) {
              return { ...contact, isRead: true }  // Update this one
            }
            return contact  // Leave others unchanged
          })
        })

        // Tell the sidebar to refresh the unread count badge
        fetchUnreadCount()
      }
    } catch (error) {
      console.error('Could not mark message as read:', error)
    }
  }

  if (loading) {
    return <div style={{ color: '#666', padding: '20px' }}>Loading contact messages... please wait.</div>
  }

  return (
    <div>
      {/* Page Title and Description */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
          Contact Messages
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
          View inquiries and queries sent through the contact form on the website.
        </p>
      </div>

      {/* Messages Table */}
      <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
          <thead>
            <tr style={{ background: '#fcfbfa', borderBottom: '1px solid #eae6e2' }}>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Sender</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Message Details</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Submitted At</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show empty message when no contacts exist */}
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                  No contact messages received yet.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => {
                const contactId = contact._id || contact.id

                return (
                  <tr
                    key={contactId}
                    style={{
                      borderBottom: '1px solid #eae6e2',
                      verticalAlign: 'top',
                      // Highlight unread messages with a warm background
                      background: contact.isRead ? 'transparent' : '#fffcfb'
                    }}
                  >
                    {/* Sender Name, Email, Phone */}
                    <td style={{ padding: '16px 24px', width: '220px' }}>
                      <div style={{ fontWeight: '700', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {contact.name}
                        {/* Show a red dot next to unread messages */}
                        {!contact.isRead && (
                          <span
                            title="New Message"
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#e50418',
                              display: 'inline-block'
                            }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: '13px', marginTop: '4px' }}>
                        <a href={`mailto:${contact.email}`} style={{ color: 'var(--brown)', textDecoration: 'none' }}>
                          {contact.email}
                        </a>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                        {contact.phone || 'No phone provided'}
                      </div>
                    </td>

                    {/* Subject and Message Content */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '700', color: '#444', marginBottom: '6px' }}>
                        Subject: {contact.subject || 'General Inquiry'}
                      </div>
                      <p style={{ margin: 0, color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {contact.message}
                      </p>
                    </td>

                    {/* Date and time the message was submitted */}
                    <td style={{ padding: '16px 24px', color: '#888', whiteSpace: 'nowrap', width: '160px' }}>
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>

                    {/* Mark as Read Button — only shown for unread messages */}
                    <td style={{ padding: '16px 24px', textAlign: 'right', width: '120px' }}>
                      {!contact.isRead ? (
                        <button
                          onClick={() => markMessageAsRead(contactId)}
                          style={{
                            background: 'var(--brown)',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '700',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#5c2b20'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--brown)'}
                        >
                          Mark Read
                        </button>
                      ) : (
                        // Show "Opened" text for already-read messages
                        <span style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>Opened</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
