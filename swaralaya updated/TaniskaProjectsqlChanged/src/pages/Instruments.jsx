import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation'

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span style={{ margin: '0 8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>➔</span>
          <Link to="/courses">Courses</Link>
          <span style={{ margin: '0 8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>➔</span>
          <span>Instruments</span>
        </div>
      </div>
    </div>
  )
}

const subCourses = [
  {
    key: 'harmonium',
    label: 'Harmonium',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-14-at-22.26.24_f7c3582f-1024x587.jpg',
    desc: 'Learn this instrument filled with resounding harmonies and melodies. Learn to play along to bhajans, classical music and more.',
  },
  {
    key: 'piano',
    label: 'Piano',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-18-1024x583.png',
    desc: 'Express the melodies that lie within, with the help of the piano; an instrument with a beautiful combination of minor and major scales.',
  },
  {
    key: 'dholak',
    label: 'Dholak',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-19-1024x583.png',
    desc: 'Groove along to the intricate rhythmic patterns that you can produce with the Dholak. Add life and rhythm to your musical journey, by learning this wonderful instrument.',
  },
]

const whoShouldJoin = [
  'Classical music students wanting formal training',
  'Percussion enthusiasts seeking authentic guidance',
  'Music teachers looking to expand their knowledge',
  'World musicians exploring Indian traditions',
  'Serious learners pursuing long-term study',
]

const videos = [
  { id: 'uf-i8rlwTV8', title: 'Chethi Mandaram Thulasi | Vishu' },
  { id: 'QrPKqBctY48', title: 'Jai Ganesha Deva | Ganesh Chathur' },
  { id: 'oa9kk6Q4Iz4', title: 'Jai Jai Vaishnavi Devi Maa | Kids' },
  { id: 'M2IPHFoLIXU', title: 'Tripura Sundari Maa | Navratri' },
  { id: 'xkV2v003ydY', title: 'Highlights | Swarakshara 2022' },
  { id: 'fbj7iNkL6IM', title: 'Oh Come All Ye Faithful | Carol' },
]

export default function Instruments() {
  const [activeTab, setActiveTab] = useState('harmonium')
  const ref1 = useScrollAnimation()
  const ref2 = useScrollAnimation()
  const ref3 = useScrollAnimation()
  const ref4 = useScrollAnimation()
  const ref5 = useScrollAnimation()
  const ref6 = useScrollAnimation()
  const countRef = useCountUp(10, 2000)

  const active = subCourses.find(c => c.key === activeTab)

  return (
    <>
      <PageBanner title="Instruments" breadcrumb="Instruments" />

      {/* Intro Section */}
      <section className="section" ref={ref1}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="two-col-grid">
            <div className="fade-in-left">
              <img
                src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/DeWatermark.ai_1749100459089.jpg"
                alt="Carnatic instrumental music at Swaralaya"
                style={{ width: '100%', borderRadius: '10px', display: 'block' }}
                loading="lazy"
              />
            </div>
            <div className="fade-in-right">
              <span style={{ color: 'var(--brown)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Instruments</span>
              <h2 style={{ fontFamily: 'var(--font-slab)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--brown)', lineHeight: 1.25, marginBottom: '18px' }}>
                Carnatic Music Instruments
              </h2>
              <div style={{ width: '48px', height: '3px', background: 'var(--brown)', borderRadius: '2px', marginBottom: '22px' }}></div>
              <p style={{ color: '#666', lineHeight: 1.9, fontSize: '15.5px', marginBottom: '30px' }}>
                Carnatic instrumental music offers a captivating journey into one of the world's most sophisticated classical traditions. For aspiring musicians, Swaralaya Carnatic Music courses provide a structured pathway to mastery.
              </p>
              <Link
                to="/enroll-now"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  border: '2px solid var(--brown)', color: 'var(--brown)',
                  background: 'transparent', padding: '11px 28px',
                  borderRadius: '50px', fontWeight: 700, fontSize: '15px',
                  transition: 'all 0.25s ease', textDecoration: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brown)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brown)' }}
              >
                Enroll Now ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Courses Section */}
      <section className="section" ref={ref2} style={{ background: '#fff', borderTop: '1px solid #f0ece8' }}>
        <div className="container">
          {/* Section Heading */}
          <h2 style={{ fontFamily: 'var(--font-slab)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: 'var(--brown)', textAlign: 'center', marginBottom: '36px' }}>
            Courses We Offer Under Instrumental Music
          </h2>

          {/* Tab Buttons — ACTIVE = outline only, INACTIVE = filled dark brown */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
            {subCourses.map(course => {
              const isActive = activeTab === course.key
              return (
                <button
                  key={course.key}
                  onClick={() => setActiveTab(course.key)}
                  style={{
                    padding: '10px 26px',
                    borderRadius: '4px',
                    border: '2px solid var(--brown)',
                    background: isActive ? 'transparent' : 'var(--brown)',
                    color: isActive ? 'var(--brown)' : '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    fontFamily: 'var(--font-main)',
                    letterSpacing: '0.2px',
                  }}
                >
                  {course.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content Panel — image left, text right */}
          {active && (
            <div key={activeTab} style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }} className="tab-content-panel">
              {/* Image — compact fixed width */}
              <div style={{ flexShrink: 0, width: '300px' }} className="tab-image-col">
                <img
                  src={active.image}
                  alt={active.label}
                  style={{ width: '100%', display: 'block', borderRadius: '6px' }}
                  loading="lazy"
                />
              </div>
              {/* Text */}
              <div style={{ flex: 1, paddingTop: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-slab)', fontSize: '26px', fontWeight: 800, color: 'var(--brown)', marginBottom: '14px' }}>
                  {active.label}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.85, fontSize: '15px', marginBottom: '26px' }}>
                  {active.desc}
                </p>
                <Link
                  to="/enroll-now"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    border: '2px solid var(--brown)', color: 'var(--brown)',
                    background: 'transparent', padding: '10px 26px',
                    borderRadius: '50px', fontWeight: 700, fontSize: '14.5px',
                    transition: 'all 0.25s ease', textDecoration: 'none'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--brown)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brown)' }}
                >
                  Enroll Now ↗
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Who Should Join — screenshot design */}
      <section
        ref={ref3}
        style={{
          position: 'relative',
          padding: '80px 0',
          backgroundImage: 'url(/vocals-section-3-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.82)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="two-col-grid">

            {/* LEFT — circular image + mandala + counter box */}
            <div className="fade-in-left" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <svg
                viewBox="0 0 340 340"
                style={{ position: 'absolute', left: '-30px', bottom: '-20px', width: '220px', opacity: 0.12, zIndex: 0 }}
                fill="none"
              >
                <circle cx="170" cy="170" r="160" stroke="#6f3527" strokeWidth="1.5" />
                <circle cx="170" cy="170" r="130" stroke="#6f3527" strokeWidth="1" />
                <circle cx="170" cy="170" r="100" stroke="#6f3527" strokeWidth="1" />
                <circle cx="170" cy="170" r="70" stroke="#6f3527" strokeWidth="1" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
                  <line key={a}
                    x1={170 + 70 * Math.cos(a * Math.PI / 180)}
                    y1={170 + 70 * Math.sin(a * Math.PI / 180)}
                    x2={170 + 160 * Math.cos(a * Math.PI / 180)}
                    y2={170 + 160 * Math.sin(a * Math.PI / 180)}
                    stroke="#6f3527" strokeWidth="0.8"
                  />
                ))}
              </svg>
              <div style={{
                position: 'relative', zIndex: 1,
                width: '380px', height: '380px',
                borderRadius: '50%', overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(111,53,39,0.2)'
              }} className="vocalist-circle">
                <img
                  src="/instruments-img.webp"
                  alt="Musician at Swaralaya"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>
              <div style={{
                position: 'absolute', bottom: '-10px', right: 'calc(50% - 230px)',
                zIndex: 2, background: '#5c2011', borderRadius: '8px',
                padding: '24px 32px', minWidth: '170px',
                boxShadow: '0 8px 30px rgba(92,32,17,0.35)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2px', marginBottom: '6px' }}>
                  <span
                    ref={countRef}
                    style={{ fontSize: '52px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-slab)', lineHeight: 1 }}
                  >0</span>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginTop: '6px' }}>+</span>
                </div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, lineHeight: 1.3, marginTop: '4px' }}>Years Of<br />Experience</div>
                <div style={{ width: '36px', height: '2px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px', marginTop: '12px' }}></div>
              </div>
            </div>

            {/* RIGHT — heading, checklist, button */}
            <div className="fade-in-right">
              <h2 style={{ fontFamily: 'var(--font-slab)', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: 'var(--brown)', marginBottom: '18px' }}>
                Who Should Join?
              </h2>
              <p style={{ color: '#555', fontSize: '15.5px', lineHeight: 1.75, marginBottom: '28px' }}>
                Unlock the power of your voice and immerse yourself in the timeless beauty of Instrumental music!
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {whoShouldJoin.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15.5px', color: '#333', lineHeight: 1.6 }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--brown)', color: '#fff', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800, marginTop: '2px'
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--brown)', color: '#fff',
                  padding: '13px 32px', borderRadius: '50px',
                  fontWeight: 700, fontSize: '15px',
                  transition: 'background 0.25s ease', textDecoration: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#5c2b20'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--brown)'}
              >
                Contact Us ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="section videos-section" ref={ref4} style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: 'var(--brown)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Videos</span>
            <h2 style={{ fontFamily: 'var(--font-slab)', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, color: 'var(--brown)' }}>
              See the Magic, Feel the Rhythm
            </h2>
            <div style={{ width: '48px', height: '3px', background: 'var(--brown)', borderRadius: '2px', margin: '14px auto 0' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="sub-courses-grid-3">
            {videos.map(v => (
              <div key={v.id} style={{ background: '#fafafa', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eae6e2' }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#333', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{v.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link
              to="/video"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--brown)', color: '#fff', padding: '12px 32px',
                borderRadius: '4px', fontWeight: 700, fontSize: '15px',
                transition: 'background 0.25s ease', textDecoration: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#5c2b20'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--brown)'}
            >
              More Videos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ref5} style={{ background: 'var(--brown)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container fade-in">
          <h2 style={{ fontFamily: 'var(--font-slab)', fontSize: 'clamp(20px,3vw,34px)', fontWeight: 800, color: '#fff', marginBottom: '28px', maxWidth: '700px', margin: '0 auto 28px' }}>
            Unlock the power of your voice and immerse yourself in the timeless beauty of Instrumental music!
          </h2>
          <Link
            to="/enroll-now"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: 'var(--brown)', padding: '13px 36px',
              borderRadius: '4px', fontWeight: 800, fontSize: '15px',
              transition: 'background 0.25s ease', textDecoration: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5ede9'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Enroll Now ↗
          </Link>
        </div>
      </section>
    </>
  )
}
