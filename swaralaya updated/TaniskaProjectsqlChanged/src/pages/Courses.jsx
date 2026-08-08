import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

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

export default function Courses() {
  const ref1 = useScrollAnimation()
  const ref2 = useScrollAnimation()
  const ref3 = useScrollAnimation()

  const youtubeVideos = [
    { id: 'uf-i8rlwTV8', title: 'Chethi Mandaram Thulasi | Vishu' },
    { id: 'QrPKqBctY48', title: 'Jai Ganesha Deva | Ganesh Chathur' },
    { id: 'oa9kk6Q4Iz4', title: 'Jai Jai Vaishnavi Devi Maa | Kids Si' },
    { id: 'M2IPHFoLIXU', title: 'Tripura Sundari Maa | Navratri | Dev' },
    { id: 'xkV2v003ydY', title: 'Highlights | Swarakshara 2022 | An' },
    { id: 'fbj7iNkL6IM', title: 'Oh Come All Ye Faithful | Carol | Kid' }
  ]

  return (
    <>
      <PageBanner title="Courses" breadcrumb="Courses" />

      {/* Intro & Categories */}
      <section className="section" ref={ref1}>
        <div className="container">
          <div className="section-title center fade-in">
            <span className="sm-title" style={{ color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>What We Teach</span>
            <h2 className="main-title" style={{ color: 'var(--brown)', fontFamily: 'var(--font-slab)', fontWeight: 'bold', fontSize: '32px' }}>Learn a Variety of Musical Genres</h2>
            <div className="title-divider"></div>
            <p className="title-desc" style={{ color: 'var(--gray)', fontSize: '15.5px', maxWidth: '720px', margin: '0 auto' }}>
              From Carnatic and devotional music, to grooving along with light music, Swaralaya gives you a chance to discover a variety of musical hues that emerge from within!
            </p>
          </div>

          {/* 2 Column Category Cards */}
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '50px' }}>
            {/* Vocals */}
            <div className="course-card-new" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #eae6e2' }}>
              <Link to="/vocals">
                <img src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg" alt="Vocals" style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} />
              </Link>
              <div style={{ background: '#f5f4f2', padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>Vocals</h3>
                <Link to="/vocals" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' }} className="arrow-btn">
                  <i className="fa-solid fa-arrow-right" style={{ color: '#fff', fontSize: '16px' }}></i>
                </Link>
              </div>
            </div>

            {/* Instruments */}
            <div className="course-card-new" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #eae6e2' }}>
              <Link to="/instruments">
                <img src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-4-1024x583.png" alt="Instruments" style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} />
              </Link>
              <div style={{ background: '#f5f4f2', padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>Instruments</h3>
                <Link to="/instruments" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' }} className="arrow-btn">
                  <i className="fa-solid fa-arrow-right" style={{ color: '#fff', fontSize: '16px' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="section" ref={ref2} style={{ background: '#f6f8fb', borderTop: '1px solid #eae6e2' }}>
        <div className="container">
          <div className="section-title center fade-in">
            <span className="sm-title" style={{ color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Videos</span>
            <h2 className="main-title" style={{ color: 'var(--brown)', fontFamily: 'var(--font-slab)', fontWeight: 'bold', fontSize: '32px' }}>See the Magic, Feel the Rhythm</h2>
            <div className="title-divider"></div>
          </div>

          {/* 3 Column Video Grid */}
          <div className="videos-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginTop: '40px' }}>
            {youtubeVideos.map((v) => (
              <div key={v.id} className="video-card-item" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #eae6e2' }}>
                <div className="video-thumb" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '16px 20px', background: '#f9f9f9' }}>
                  <p style={{ margin: 0, color: '#222222', fontSize: '14.5px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{v.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* More Videos Button */}
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link
              to="/video"
              className="theme-btn"
              style={{
                background: 'var(--brown)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#5c2b20')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brown)')}
            >
              More Videos <span style={{ fontSize: '12px' }}>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
