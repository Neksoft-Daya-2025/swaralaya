import { Link } from 'react-router-dom'

// Simple SVG Icons matching the screenshot's outline styling
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{ background: '#6F3527', color: '#fff', padding: '60px 0 20px', fontFamily: 'var(--font-main)' }}>
      <div className="container">
        
        {/* Top Row: Heading and Social Icons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingBottom: '35px' }}>
          <h2 style={{
            fontSize: 'clamp(20px, 2.5vw, 32px)',
            fontWeight: '700',
            maxWidth: '650px',
            lineHeight: '1.3',
            margin: 0,
            color: '#fff',
            fontFamily: 'var(--font-main)'
          }}>
            Indian Carnatic music classes to help you discover the melody within.
          </h2>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { href: 'https://www.facebook.com/swaralayaschoolofmusic', icon: 'fa-facebook-f', label: 'Facebook' },
              { href: 'https://www.youtube.com/@swaralayaschoolofmusic', icon: 'fa-youtube', label: 'YouTube' },
              { href: 'https://www.instagram.com/swaralayamusicschool_nl/', icon: 'fa-instagram', label: 'Instagram' },
              { href: 'https://wa.me/31642825268', icon: 'fa-whatsapp', label: 'WhatsApp' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'background 0.25s ease, border-color 0.25s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)' }}
              >
                <i className={`fa-brands ${s.icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.1)', marginBottom: '45px' }}></div>

        {/* Main 4-Column Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
          gap: '40px',
          paddingBottom: '50px'
        }} className="footer-grid">
          
          {/* Column 1: Logo & Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <img
                src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2023/04/white-logo.png"
                alt="Swaralaya School of Music"
                style={{ height: '48px', width: 'auto', display: 'block', marginBottom: '6px' }}
              />
              <span style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8, fontWeight: '700' }}>
                Discover the melody in you!
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <PinIcon />
                <span style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.9 }}>
                  J J Slauerhoffstraat 63, 1321RA Almere, Netherlands.
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <EnvelopeIcon />
                <a
                  href="mailto:info@swaralayaschoolofmusic.nl"
                  style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', opacity: 0.9 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  info@swaralayaschoolofmusic.nl
                </a>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <PhoneIcon />
                <a
                  href="tel:+31642825268"
                  style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', opacity: 0.9 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  +31 6428 25268
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Business Details */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '22px', color: '#fff' }}>Business Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px', color: '#fff' }}>Business Name</h4>
                <p style={{ fontSize: '14px', margin: 0, opacity: 0.85 }}>Swaralaya School of Music</p>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px', color: '#fff' }}>KVK Number</h4>
                <p style={{ fontSize: '14px', margin: 0, opacity: 0.85 }}>77191943</p>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '22px', color: '#fff' }}>Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'About Us', to: '/about-us' },
                { label: 'Courses', to: '/courses' },
                { label: 'Benefits', to: '/benefits' },
                { label: 'Videos', to: '/video' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Stay Informed with Newsletter */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '22px', color: '#fff' }}>Stay Informed with Newsletter</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, opacity: 0.85 }}>
              I'm okay with getting promotion emails and new letters to improve my experience.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>
            Copyright 2025, powered by{' '}
            <a
              href="https://neksoft.nl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline' }}
            >
              Neksoft Consultancy Services
            </a>
          </p>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'GDPR', to: '/contact' },
              { label: 'Privacy & Cookie Policy', to: '/contact' },
              { label: 'Terms of Service', to: '/contact' },
            ].map(l => (
              <Link
                key={l.label}
                to={l.to}
                style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Back to Top Circular Arrow Overlay Button */}
      {/* <button
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          position: 'fixed',
          bottom: '85px',
          right: '25px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          zIndex: '999',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e50418'; e.currentTarget.style.borderColor = '#e50418' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)' }}
      >
        <i className="fa-solid fa-chevron-up"></i>
      </button> */}
    </footer>
  )
}
