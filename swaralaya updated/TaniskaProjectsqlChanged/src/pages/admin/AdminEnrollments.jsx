import { useEffect, useState } from 'react'

// This page shows a list of all enrollment applications submitted by students.
// All enrollments are automatically accepted and a confirmation email is sent.
// The admin can view all details of each enrollment.
export default function AdminEnrollments() {
  // The list of all enrollment records from the database
  const [enrollments, setEnrollments] = useState([])

  // Loading state to show a message while data is being fetched
  const [loading, setLoading] = useState(true)

  // The enrollment that was clicked to view details
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)

  // Whether to show the details modal dialog
  const [showModal, setShowModal] = useState(false)

  // Load enrollments from backend when the component first renders
  useEffect(() => {
    fetchAllEnrollments()
  }, [])

  // Fetch all enrollment submissions from the backend
  const fetchAllEnrollments = async () => {
    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch('http://localhost:3001/api/enrollments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setEnrollments(data)
      }
    } catch (error) {
      console.error('Could not fetch enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Open the details modal for a specific enrollment
  const openDetailsModal = (enrollment) => {
    setSelectedEnrollment(enrollment)
    setShowModal(true)
  }

  // Close the details modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedEnrollment(null)
  }

  // Helper: decide badge color based on status
  const getStatusStyle = (status) => {
    if (status === 'accepted') {
      return { background: '#e8f5e9', color: '#2e7d32' }
    }
    if (status === 'rejected') {
      return { background: '#ffebee', color: '#c62828' }
    }
    // Default: pending
    return { background: '#fff3e0', color: '#e65100' }
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return <div style={{ color: '#666', padding: '20px' }}>Loading enrollment applications... please wait.</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
          Enrollment Applications
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
          All enrollments are automatically accepted. A confirmation email is sent to the student immediately upon submission.
        </p>
      </div>

      {/* Enrollments Table */}
      <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
          <thead>
            <tr style={{ background: '#fcfbfa', borderBottom: '1px solid #eae6e2' }}>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Name</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Contact Info</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Course</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Experience</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555', textAlign: 'right' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty state when no applications exist */}
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                  No enrollment requests submitted yet.
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => {
                const enrollId = enrollment._id || enrollment.id

                return (
                  <tr key={enrollId} style={{ borderBottom: '1px solid #eae6e2', verticalAlign: 'top' }}>

                    {/* Student Name and Age */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '700', color: '#333' }}>{enrollment.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        Age: {enrollment.age || 'N/A'}
                      </div>
                    </td>

                    {/* Email and Phone */}
                    <td style={{ padding: '16px 24px' }}>
                      <div>
                        <a href={`mailto:${enrollment.email}`} style={{ color: 'var(--brown)', textDecoration: 'none' }}>
                          {enrollment.email}
                        </a>
                      </div>
                      <div style={{ color: '#666', marginTop: '2px' }}>{enrollment.phone || 'No phone provided'}</div>
                    </td>

                    {/* Course selected */}
                    <td style={{ padding: '16px 24px', color: '#333', fontWeight: '600' }}>
                      {enrollment.course || 'Not specified'}
                    </td>

                    {/* Musical experience */}
                    <td style={{ padding: '16px 24px', color: '#666' }}>
                      {enrollment.experience || 'Not specified'}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        ...getStatusStyle(enrollment.status),
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {enrollment.status.toUpperCase()}
                      </span>
                    </td>

                    {/* View Details button */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => openDetailsModal(enrollment)}
                        style={{
                          background: 'var(--brown)',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal — appears as a popup overlay */}
      {showModal && selectedEnrollment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--brown)', margin: '0 0 20px' }}>
              Enrollment Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Name */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Full Name</span>
                <span style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>{selectedEnrollment.fullName}</span>
              </div>

              {/* Email */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Email</span>
                <a href={`mailto:${selectedEnrollment.email}`} style={{ fontSize: '16px', color: 'var(--brown)', textDecoration: 'none' }}>
                  {selectedEnrollment.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Phone</span>
                <span style={{ fontSize: '16px', color: '#333' }}>{selectedEnrollment.phone || 'Not provided'}</span>
              </div>

              {/* Age */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Age</span>
                <span style={{ fontSize: '16px', color: '#333' }}>{selectedEnrollment.age || 'Not provided'}</span>
              </div>

              {/* Course */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Course</span>
                <span style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>{selectedEnrollment.course || 'Not specified'}</span>
              </div>

              {/* Experience */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Experience Level</span>
                <span style={{ fontSize: '16px', color: '#333' }}>{selectedEnrollment.experience || 'Not specified'}</span>
              </div>

              {/* Status */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Status</span>
                <span style={{
                  ...getStatusStyle(selectedEnrollment.status),
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'inline-block'
                }}>
                  {selectedEnrollment.status.toUpperCase()}
                </span>
              </div>

              {/* Message */}
              {selectedEnrollment.message && (
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Message</span>
                  <div style={{
                    fontSize: '14px',
                    color: '#555',
                    background: '#f9f9f9',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedEnrollment.message}
                  </div>
                </div>
              )}

              {/* Submitted Date */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Submitted On</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{formatDate(selectedEnrollment.createdAt)}</span>
              </div>
            </div>

            {/* Close button */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{
                  background: 'var(--brown)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}