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

const teamMembers = [
  {
    name: 'Founder & Director',
    role: 'Carnatic Vocal Expert',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Swaralaya-Founder-831x1024.jpeg',
    desc: 'With over 15 years of experience in Carnatic music, our founder brings passion and expertise to every lesson.',
  },
  {
    name: 'Senior Vocal Teacher',
    role: 'Devotional & Light Music',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg',
    desc: 'A seasoned performer with extensive experience in devotional and light music traditions across India and Europe.',
  },
  {
    name: 'Instruments Teacher',
    role: 'Keyboard & Guitar',
    image: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-4-1024x583.png',
    desc: 'Expert instructor specializing in keyboard and guitar, helping students find their unique musical expression.',
  },
]

const youtubeVideos = [
  { id: 'uf-i8rlwTV8', title: 'Student Performance 1' },
  { id: 'QrPKqBctY48', title: 'Student Performance 2' },
  { id: 'oa9kk6Q4Iz4', title: 'Student Performance 3' },
  { id: 'M2IPHFoLIXU', title: 'Student Performance 4' },
  { id: 'xkV2v003ydY', title: 'Student Performance 5' },
  { id: 'fbj7iNkL6IM', title: 'Student Performance 6' },
]

export default function About() {
  const ref1 = useScrollAnimation()
  const ref2 = useScrollAnimation()
  const ref3 = useScrollAnimation()
  const ref4 = useScrollAnimation()

  return (
    <>
      <PageBanner title="About Us" breadcrumb="About Us" />

      {/* Section 1: Discover the Joy of Music */}
      <section className="section" ref={ref1} style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '50px', alignItems: 'center' }}>
            {/* Left Column: Image */}
            <div className="fade-in-left">
              <div className="about-image-wrap" style={{ position: 'relative' }}>
                <img
                  src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/music13-2-gigapixel-cgi-6x-681x1024.png"
                  alt="Swaralaya Sitar Silhouette"
                  loading="lazy"
                  style={{
                    width: '100%',
                    borderRadius: '0',
                    boxShadow: 'none',
                    maxHeight: '520px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="fade-in-right">
              <span className="sm-title" style={{ display: 'block', fontSize: '15px', color: '#888888', marginBottom: '8px', fontWeight: 500 }}>
                About Swaralaya School of Music
              </span>
              <h2 className="main-title" style={{ fontSize: '38px', fontWeight: '700', color: 'var(--brown)', lineHeight: '1.25', marginBottom: '24px', fontFamily: 'var(--font-slab)' }}>
                Discover the Joy of Music with Swaralaya
              </h2>

              {/* Styled Paragraphs Container with Left Border */}
              <div style={{
                borderLeft: '4px solid var(--brown)',
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.75', margin: 0 }}>
                  Welcome to <strong>Swaralaya School of Music</strong>, a premier institution dedicated to nurturing musical talent and fostering a deep appreciation for the art of music. Based in the Netherlands, we offer a vibrant and inclusive learning environment where students of all ages and skill levels can explore, create, and excel in their musical journey.
                </p>
                <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.75', margin: 0 }}>
                  At Swaralaya, we believe that music is a universal language that transcends boundaries. Whether you’re a beginner taking your first steps or an advanced musician refining your craft, our expert instructors, personalized approach, and rich curriculum ensure a fulfilling and inspiring experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="section" ref={ref2} style={{ background: 'white', color: 'black' }}>
        <div className="container">
          <div className="section-title center fade-in">
            <span className="sm-title" style={{ color: 'rgba(229, 4, 24, 0.9)' }}>Videos</span>
            <h2 className="main-title" style={{ color: 'var(--brown)', fontFamily: 'var(--font-slab)' }}>
              See the Magic, Feel the Rhythm
            </h2>
          <div className="title-divider" style={{ margin: '16px auto 0' }}></div>
        </div>

        <div className="videos-grid fade-in" style={{ marginTop: '40px' }}>
          {youtubeVideos.map(v => (
            <div className="video-card" key={v.id}>
              <div className="video-thumb">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link to="/video" className="theme-btn theme-btn-primary">
            More Videos <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section >

    </>
  )
}
