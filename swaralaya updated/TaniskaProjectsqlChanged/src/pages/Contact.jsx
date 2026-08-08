import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Contact() {
  const ref1 = useScrollAnimation()
  const ref2 = useScrollAnimation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
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
      const res = await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          subject: 'Website Contact Submission'
        })
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
        setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Network error. Please make sure the server is running.')
    }
  }

  return (
    <>
      {/* Contact Section */}
      <section
        ref={ref1}
        style={{
          background: '#f6f8fb',
          padding: '140px 0 80px',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40% 60%',
              gap: '48px',
              alignItems: 'start'
            }}
            className="contact-grid-custom"
          >
            {/* Left Column: Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <span
                  style={{
                    color: 'var(--brown)',
                    fontSize: '15px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  Get In Touch
                </span>
                <h1
                  style={{
                    fontSize: 'clamp(28px, 3.5vw, 40px)',
                    fontWeight: '800',
                    color: 'var(--brown)',
                    lineHeight: '1.25',
                    marginBottom: '14px',
                    fontFamily: 'var(--font-slab)'
                  }}
                >
                  Need Any Help? Or Looking For any Consultation ?
                </h1>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#666666',
                    fontStyle: 'italic',
                    margin: 0
                  }}
                >
                  "Feel free to write to us."
                </p>
              </div>

              {/* Info Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '10px' }}>
                {/* Visit Us */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(111,53,39,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--brown)', fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Visit Us</h4>
                    <p style={{ fontSize: '14.5px', color: '#555555', margin: 0, lineHeight: '1.5' }}>
                      J J Slauerhoffstraat 63, 1321RA Almere, Netherlands.
                    </p>
                  </div>
                </div>

                {/* Email Us */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(111,53,39,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <i className="fa-solid fa-envelope" style={{ color: 'var(--brown)', fontSize: '18px' }}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Email Us</h4>
                    <p style={{ margin: 0 }}>
                      <a
                        href="mailto:info@swaralayaschoolofmusic.nl"
                        style={{ fontSize: '14.5px', color: '#555555', transition: 'color 0.3s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
                      >
                        info@swaralayaschoolofmusic.nl
                      </a>
                    </p>
                  </div>
                </div>

                {/* Call Us */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(111,53,39,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <i className="fa-solid fa-phone" style={{ color: 'var(--brown)', fontSize: '18px' }}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Call Us</h4>
                    <p style={{ margin: 0 }}>
                      <a
                        href="tel:+31642825268"
                        style={{ fontSize: '14.5px', color: '#555555', transition: 'color 0.3s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
                      >
                        +31 6428 25268
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                {[
                  { icon: 'fa-facebook-f', url: 'https://www.facebook.com/swaralayaschoolofmusic' },
                  { icon: 'fa-instagram', url: 'https://www.instagram.com/swaralayamusicschool_nl/' },
                  { icon: 'fa-youtube', url: 'https://www.youtube.com/@swaralayaschoolofmusic' },
                  { icon: 'fa-whatsapp', url: 'https://api.whatsapp.com/send?phone=31642825268' }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--brown)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#5c2b20'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--brown)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <i className={`fa-brands ${s.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column: Contact Form */}
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
                  Thank you! Your message has been sent. We will get back to you shortly.
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

                {/* Row 3: Message */}
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
                <div style={{ marginTop: '8px' }}>
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
        </div>
      </section>

      {/* Map Section */}
      <section ref={ref2} style={{ width: '100%', height: '480px', lineHieght: 0, display: 'block', overflow: 'hidden' }}>
        <iframe
          title="Swaralaya School of Music Almere Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.0620896791196!2d5.263590577033501!3d52.3512219720172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c617b07d6a59cb%3A0xc3fcd7795d2c2069!2sJ.%20J.%20Slauerhoffstraat%2063%2C%201321%20RA%20Almere%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1700000000000!5m2!1sen!2snl"
          style={{ width: '100%', height: '100%', border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
