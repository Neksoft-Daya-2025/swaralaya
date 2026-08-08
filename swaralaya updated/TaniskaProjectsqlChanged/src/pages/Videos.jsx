import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// All 12 videos from the live site (same order)
const allVideos = [
  { id: 'uf-i8rlwTV8', title: 'Chethi Mandaram Thulasi | Vishu Special' },
  { id: '6eKO3kWQYU8', title: 'Swaralaya Annual Day 2024' },
  { id: 'fbj7iNkL6IM', title: 'Oh Come All Ye Faithful | Carol Night' },
  { id: 'sOaFp9b0Skk', title: 'Carnatic Classical Recital' },
  { id: 'M2IPHFoLIXU', title: 'Tripura Sundari Maa | Navratri Special' },
  { id: 'QrPKqBctY48', title: 'Jai Ganesha Deva | Ganesh Chathurthi' },
  { id: 'oa9kk6Q4Iz4', title: 'Jai Jai Vaishnavi Devi Maa | Kids Special' },
  { id: '2kPLIIF6aPo', title: 'Swarakshara 2023 Highlights' },
  { id: 'C37W2Y-afxU', title: 'Student Showcase Performance' },
  { id: 'xkV2v003ydY', title: 'Highlights | Swarakshara 2022' },
  { id: 'yQ6Po5e009A', title: 'Devotional Music Session' },
  { id: 'RM5s2QD1Q3g', title: 'Swaralaya School of Music' },
]

export default function Videos() {
  const ref1 = useScrollAnimation()
  const ref2 = useScrollAnimation()
  const ref3 = useScrollAnimation()

  return (
    <>


      {/* Heading Section */}
      <section className="section" ref={ref1} style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-title right fade-in" style={{ marginBottom: '60px' }}>
            <span style={{
              color: 'var(--brown)', textTransform: 'uppercase', fontWeight: 700,
              letterSpacing: '2px', fontSize: '13px', display: 'block', marginBottom: '12px'
            }}>Videos</span>
            <h2 style={{
              fontFamily: 'var(--font-slab)', fontSize: 'clamp(24px,3vw,38px)',
              fontWeight: 800, color: 'var(--brown)', lineHeight: 1.25
            }}>
              What Makes Carnatic Music So Special?
            </h2>
            <div style={{ width: '50px', height: '3px', background: 'var(--brown)', borderRadius: '2px', margin: '18px auto 0' }}></div>
          </div>

          {/* 3-column video grid */}
          <div ref={ref2} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }} className="sub-courses-grid-3">
            {allVideos.map((v, i) => (
              <div
                key={v.id}
                className="fade-in"
                style={{
                  borderRadius: '10px', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #eae6e2',
                  background: '#fff',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animationDelay: `${i * 0.05}s`
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(111,53,39,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)' }}
              >
                {/* 16:9 iframe */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                    title={v.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                {/* Title bar */}
                <div style={{ padding: '14px 18px', borderTop: '1px solid #f0ece8' }}>
                  <p style={{
                    margin: 0, fontSize: '14px', fontWeight: 600,
                    color: 'var(--brown)', overflow: 'hidden',
                    whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                  }}>{v.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Channel link */}
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <a
              href="https://www.youtube.com/@swaralayaschoolofmusic"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: '#FF0000', color: '#fff',
                padding: '14px 36px', borderRadius: '4px',
                fontWeight: 700, fontSize: '15px',
                transition: 'background 0.25s ease', textDecoration: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#cc0000'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF0000'}
            >
              <i className="fa-brands fa-youtube" style={{ fontSize: '18px' }}></i>
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section ref={ref3} style={{ background: 'var(--brown)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container fade-in">
          <h2 style={{
            fontFamily: 'var(--font-slab)', fontSize: 'clamp(22px,3vw,36px)',
            fontWeight: 800, color: '#fff', marginBottom: '16px', maxWidth: '650px', margin: '0 auto 24px'
          }}>
            Indian Carnatic music classes to help you discover the melody within.
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/enroll-now"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#fff', color: 'var(--brown)',
                padding: '13px 32px', borderRadius: '4px',
                fontWeight: 800, fontSize: '15px',
                transition: 'background 0.25s ease', textDecoration: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5ede9'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              Enroll Now ↗
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent', color: '#fff',
                border: '2px solid rgba(255,255,255,0.7)',
                padding: '13px 32px', borderRadius: '4px',
                fontWeight: 700, fontSize: '15px',
                transition: 'all 0.25s ease', textDecoration: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
