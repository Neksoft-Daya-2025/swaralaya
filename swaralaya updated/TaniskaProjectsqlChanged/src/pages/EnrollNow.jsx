import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span style={{ margin: '0 8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>➔</span>
          <span>{breadcrumb}</span>
        </div>
      </div>
    </div>
  )
}

export default function EnrollNow() {
  const ref = useScrollAnimation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    course: '',
    experience: '',
    age: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const res = await fetch('http://localhost:3001/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          course: formData.course,
          experience: formData.experience,
          age: formData.age
        })
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
        setFormData({ firstName: '', lastName: '', phone: '', email: '', course: '', experience: '', age: '', message: '' })
      } else {
        alert('Failed to submit enrollment request. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Network error. Please make sure the server is running.')
    }
  }

  return (
    <>
      <PageBanner title="Enroll now" breadcrumb="Enroll now" />

      {/* Form Section */}
      <section
        ref={ref}
        style={{
          background: '#f6f8fb',
          padding: '80px 0',
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Form Container */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              border: '1px solid #eae6e2'
            }}
          >
            {submitted && (
              <div
                style={{
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  color: '#155724',
                  borderRadius: '6px',
                  padding: '14px 20px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px'
                }}
              >
                <i className="fa-solid fa-circle-check"></i>
                Thank you! Your enrollment has been submitted successfully. You will receive a confirmation email shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Row 1: First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-custom">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Your First Name"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Your Last Name"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-custom">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Your Phone Number"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email Address"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Course Selection (Dropdown) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Select Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #eae6e2',
                    fontSize: '15px',
                    outline: 'none',
                    background: '#fcfcfc',
                    width: '100%',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    color: formData.course ? '#333' : '#999'
                  }}
                >
                  <option value="" disabled>Select a course...</option>
                  <option value="Vocals">🎤 Vocals (Carnatic / Classical Singing)</option>
                  <option value="Instruments">🎸 Instruments (Guitar, Violin, Keyboard, etc.)</option>
                </select>
              </div>

              {/* Row 4: Age & Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-custom">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your Age"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Experience Level</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #eae6e2',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fcfcfc',
                      width: '100%',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      color: formData.experience ? '#333' : '#999'
                    }}
                  >
                    <option value="" disabled>Select level...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>Tell us how we can help *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message here..."
                  style={{
                    padding: '14px',
                    borderRadius: '6px',
                    border: '1px solid #eae6e2',
                    fontFamily: 'var(--font-main)',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'vertical',
                    background: '#fcfcfc',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--brown)',
                    color: '#ffffff',
                    padding: '12px 36px',
                    borderRadius: '6px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#5c2b20')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brown)')}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}