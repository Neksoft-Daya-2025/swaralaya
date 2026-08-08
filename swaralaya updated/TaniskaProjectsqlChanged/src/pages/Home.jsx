import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation'
import { useUpcomingEvents } from '../hooks/useUpcomingEvents'
import HeroVideo from '../components/HeroVideo'

const heroSlides = [
  {
    subtitle: 'Welcome to Swaralaya',
    title: 'Learn Indian Carnatic music in a nurturing and positive environment.',
    desc: 'Indian Carnatic music classes to help you discover the melody within.',
    btn1: { label: 'Enroll Now', to: '/enroll-now' },
    btn2: { label: 'Explore Courses', to: '/courses' },
  },
  {
    subtitle: 'Vocal Training',
    title: 'Find Your Voice and Sing Your Soul Free',
    desc: 'Expert training in Carnatic, Devotional & Light Music for students of all ages.',
    btn1: { label: 'View Vocals', to: '/vocals' },
    btn2: { label: 'Contact Us', to: '/contact' },
  },
  {
    subtitle: 'Instrument Courses',
    title: 'Play Music, Create Magic, Feel the Rhythm',
    desc: 'Keyboard, Guitar, Flute and more — learn from expert instructors at your own pace.',
    btn1: { label: 'View Instruments', to: '/instruments' },
    btn2: { label: 'Enroll Now', to: '/enroll-now' },
  },
]



function AboutSection() {
  const ref = useScrollAnimation()
  const [activeTab, setActiveTab] = useState('about')

  const tabContents = {
    about: 'Swaralaya is an endeavour that has it’s genesis in Its founder Vandana Ramakrishnan’s affinity to singing right from her formative years. Under the tutelage of her mother and other eminent musicians whose life and effort to date continues to be her inspiration, Vandana discovered that the blossom of music can unfold in the heart of any aspirant who is willing to pursue it enthusiastically and dedicate time and effort.',
    mission: 'At Swaralaya School of Music, our mission is to create a nurturing, inclusive, and culturally rich environment where individuals—regardless of age, background, or musical experience—can discover, explore, and refine their musical abilities. Rooted in the profound traditions of Indian Carnatic music, we aim to preserve its essence while making it accessible and engaging for modern learners. Our teaching approach is personalized and progressive, offering step-by-step guidance tailored to each student’s pace and potential. We believe that music is not just a skill, but a medium of self-expression, inner peace, and joy. Through our structured yet flexible learning model, we empower our students to embrace music as a lifelong companion that inspires creativity, enhances emotional well-being, and fosters cultural appreciation.',
    vision: 'Swaralaya aspires to be recognized as a premier institution in the Netherlands for the learning and promotion of Indian classical music, particularly the rich tradition of Carnatic music. Our vision is to become a cultural bridge, connecting diverse communities through the timeless and borderless language of music. We aim to build a vibrant and inclusive community where students, teachers, and music lovers from all walks of life come together to celebrate the joy of musical expression. At Swaralaya, we envision a future where Indian classical music is respected, understood, and embraced globally, contributing to mutual cultural appreciation and deeper human connection.'
  }

  return (
    <section className="section" ref={ref} style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container">
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '50px', alignItems: 'center' }}>
          {/* Left Side: Founder Image */}
          <div className="fade-in-left">
            <div className="about-image-wrap" style={{ position: 'relative' }}>
              <img
                src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Founder-683x1024.jpeg"
                alt="Founder Vandana Ramakrishnan performing on stage"
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

          {/* Right Side: Content and Tabs */}
          <div className="fade-in-right">
            <h2 className="main-title" style={{ fontSize: '36px', fontWeight: '700', color: '#111111', lineHeight: '1.25', marginBottom: '24px' }}>
              Indian Carnatic music classes to help you discover the melody within.
            </h2>

            {/* Tabs */}
            <div className="about-tabs" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
              {[
                { id: 'about', label: 'About Us' },
                { id: 'mission', label: 'Mission' },
                { id: 'vision', label: 'Vision' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    fontSize: '16px',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    color: activeTab === tab.id ? 'var(--brown)' : '#666666',
                    textDecoration: 'underline',
                    textUnderlineOffset: '5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {tab.label} <span style={{ fontSize: '11px', textDecoration: 'none' }}>↗</span>
                </button>
              ))}
            </div>

            {/* Tab Paragraph */}
            <p style={{ color: '#555555', fontSize: '14.5px', lineHeight: '1.7', marginBottom: '28px', minHeight: '120px' }}>
              {tabContents[activeTab]}
            </p>

            {/* Checklist Grid */}
            <div className="about-check-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 24px',
              marginBottom: '32px'
            }}>
              {[
                'Founder-led passion',
                'Personalized training',
                'Carnatic music focus',
                'Eminent mentors',
                'Rich musical legacy',
                'Open to all ages'
              ].map((item, idx) => {
                // Reorder to match columns from screenshot:
                // Col 1: idx 0, 2, 4 -> Founder-led passion, Carnatic music focus, Rich musical legacy
                // Col 2: idx 1, 3, 5 -> Personalized training, Eminent mentors, Open to all ages
                const itemsList = [
                  'Founder-led passion',
                  'Personalized training',
                  'Carnatic music focus',
                  'Eminent mentors',
                  'Rich musical legacy',
                  'Open to all ages'
                ];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333333' }}>
                    <span style={{ color: '#666666', fontSize: '16px' }}>✓</span>
                    <span>{itemsList[idx]}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                to="/enroll-now"
                className="theme-btn btn-enroll"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  fontSize: '15px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}
              >
                Enroll Now <span style={{ fontSize: '12px' }}>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoursesSection() {
  const ref = useScrollAnimation()
  return (
    <section className="courses-section" ref={ref} style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Title Container */}
        <div className="courses-title-container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111111', marginBottom: '16px', fontFamily: 'var(--font-slab)' }}>
            Learn a variety of musical genres
          </h2>
          <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.7' }}>
            From Carnatic and devotional music, to grooving along with light music, Swaralaya gives you a chance to discover a variety of musical hues that emerge from within!
          </p>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Card 1: Vocals */}
          <div className="new-course-card" style={{ background: '#f7f5f3', display: 'flex', flexDirection: 'column' }}>
            <img
              src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg"
              alt="Vocals Course"
              loading="lazy"
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div className="new-course-card-footer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              background: '#f7f5f3',
              borderTop: '1px solid #eae6e2'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>Vocals</h3>
              <Link to="/vocals" className="new-course-card-btn" style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--brown)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Instruments */}
          <div className="new-course-card" style={{ background: '#f7f5f3', display: 'flex', flexDirection: 'column' }}>
            <img
              src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-4-1024x583.png"
              alt="Instruments Course"
              loading="lazy"
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div className="new-course-card-footer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              background: '#f7f5f3',
              borderTop: '1px solid #eae6e2'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>Instruments</h3>
              <Link to="/instruments" className="new-course-card-btn" style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--brown)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



const youtubeVideos = [
  { id: 'uf-i8rlwTV8', title: 'Student Performance 1' },
  { id: 'QrPKqBctY48', title: 'Student Performance 2' },
  { id: 'oa9kk6Q4Iz4', title: 'Student Performance 3' },
  { id: 'M2IPHFoLIXU', title: 'Student Performance 4' },
  { id: 'xkV2v003ydY', title: 'Student Performance 5' },
  { id: 'fbj7iNkL6IM', title: 'Student Performance 6' },
]

function VideosSection() {
  const ref = useScrollAnimation()
  return (
    <section className="section videos-section" ref={ref}>
      <div className="container">
        <div className="section-title center fade-in">
          <span className="sm-title">Videos</span>
          <h2 className="main-title" style={{ color: 'black', width: '25vw', margin: "auto" }}>See the Magic, Feel the Rhythm</h2>
          <div className="title-divider" style={{ margin: '16px auto 0' }}></div>
        </div>
        <div className="videos-grid fade-in">
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
    </section>
  )
}



function TestimonialsSection() {
  const ref = useScrollAnimation()
  return (
    <section className="section testimonials-section" ref={ref}>
      <div className="container">
        <div className="section-title center fade-in">
          <span className="sm-title">Client Testimonials</span>
          <h2 className="main-title">Amazing Feedback Say About Services</h2>
          <div className="title-divider"></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card fade-in" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-stars">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <i key={j} className="fa-solid fa-star" style={{ color: '#ffc107', fontSize: '13px', marginRight: '2px' }}></i>
                ))}
              </div>
              <div className="testimonial-author">
                <img className="testimonial-avatar" src={t.avatar} alt={t.name} loading="lazy" />
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const instagramPosts = [
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Swaralaya-Founder-831x1024.jpeg',
    caption: 'Our founder bringing the essence of Carnatic music to every student. 🎵 #SwaralayaSchoolOfMusic #CarnaticMusic',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg',
    caption: 'Students performing at the annual Swarakshara event. Pure talent on display! 🎶 #Swarakshara #Students',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/09/Swarlata-event.jpg',
    caption: 'A beautiful evening of music and celebration at Swaralaya. 🪔 #MusicEvent #Almere',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-4-1024x583.png',
    caption: 'Learn instruments from the best! Keyboard, Guitar, Flute and more. 🎹 #InstrumentalMusic',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Founder-scaled.jpeg',
    caption: 'Guiding students with passion and dedication. #Swaralaya #MusicTeacher',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/sheet-music-8464000_1280.jpg',
    caption: 'Every note tells a story. Come discover yours at Swaralaya. 📜 #CarnaticClassical',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/09/Swarlata-event-819x1024.jpg',
    caption: 'Swarakshara — where the seeds of melody blossom! 🌸 #AnnualDay #Swarakshara',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-16-at-10.44.02_ce283b07.jpg',
    caption: 'Our students — the heart and soul of Swaralaya. 💛 #StudentLife #MusicFamily',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2022/12/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg',
    caption: 'Devotional music sessions — connecting with the divine through melody. 🪷 #Devotional',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Swaralaya-Founder-831x1024.jpeg',
    caption: 'Proud moments on stage. Congratulations to all our performers! 🏆 #Performance',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/Untitled-design-4-1024x583.png',
    caption: 'Music is the language of the soul. Start your journey today! 🎵 #Enroll',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
  {
    src: 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/09/Swarlata-event.jpg',
    caption: 'Thank you for supporting us! Follow us on Instagram for more updates. ❤️ #Swaralaya',
    link: 'https://www.instagram.com/swaralayamusicschool_nl/',
  },
]

function InstagramSection() {
  const ref = useScrollAnimation()
  const [current, setCurrent] = useState(0)
  const [modal, setModal] = useState(null) // index or null
  const VISIBLE = 3
  const total = instagramPosts.length
  const maxIdx = total - VISIBLE // 9

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(maxIdx, c + 1))

  // Dynamic bullet count: show 5 dots max
  const DOT_COUNT = 5
  const totalDots = maxIdx + 1
  const getVisibleDots = () => {
    if (totalDots <= DOT_COUNT) return Array.from({ length: totalDots }, (_, i) => i)
    const half = Math.floor(DOT_COUNT / 2)
    let start = Math.max(0, current - half)
    let end = start + DOT_COUNT
    if (end > totalDots) { end = totalDots; start = end - DOT_COUNT }
    return Array.from({ length: DOT_COUNT }, (_, i) => start + i)
  }

  const modalPost = modal !== null ? instagramPosts[modal] : null

  return (
    <section className="section" ref={ref} style={{ background: '#fff', overflow: 'hidden' }}>
      <div className="container">
        {/* Section heading */}
        <div className="section-title center fade-in" style={{ marginBottom: '48px' }}>
          <span className="sm-title">Instagram</span>
          <h2 className="main-title">Have a Look</h2>
          <div className="title-divider" style={{ margin: '14px auto 0' }}></div>
        </div>

        {/* Carousel wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Prev Arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
            style={{
              position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: '44px', height: '44px', borderRadius: '50%',
              background: current === 0 ? '#e0e0e0' : 'var(--brown)',
              color: current === 0 ? '#aaa' : '#fff', border: 'none', cursor: current === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'background 0.2s ease',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Sliding track */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex', gap: '20px',
              transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + 20px / ${VISIBLE})))`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}>
              {instagramPosts.map((post, i) => (
                <div
                  key={i}
                  onClick={() => setModal(i)}
                  style={{
                    flex: `0 0 calc((100% - ${(VISIBLE - 1) * 20}px) / ${VISIBLE})`,
                    cursor: 'pointer', position: 'relative',
                    aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '4px',
                  }}
                  className="insta-item"
                >
                  <img
                    src={post.src}
                    alt={`Instagram post ${i + 1}`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div className="insta-overlay" style={{ flexDirection: 'column', gap: '10px' }}>
                    <i className="fa-brands fa-instagram" style={{ fontSize: '32px', color: '#fff' }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={next}
            disabled={current === maxIdx}
            aria-label="Next"
            style={{
              position: 'absolute', right: '-52px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: '44px', height: '44px', borderRadius: '50%',
              background: current === maxIdx ? '#e0e0e0' : 'var(--brown)',
              color: current === maxIdx ? '#aaa' : '#fff', border: 'none', cursor: current === maxIdx ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'background 0.2s ease',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Dynamic bullet pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px', marginTop: '28px' }}>
          {getVisibleDots().map((dotIdx, i, arr) => {
            const isActive = dotIdx === current
            const isEdge = i === 0 || i === arr.length - 1
            return (
              <div
                key={dotIdx}
                onClick={() => setCurrent(dotIdx)}
                style={{
                  width: isActive ? '28px' : isEdge ? '7px' : '10px',
                  height: isActive ? '10px' : isEdge ? '7px' : '10px',
                  borderRadius: '50px',
                  background: isActive ? 'var(--brown)' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              />
            )
          })}
        </div>

        {/* Instagram link */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <a
            href="https://www.instagram.com/swaralayamusicschool_nl/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              color: '#fff', padding: '12px 30px', borderRadius: '4px',
              fontWeight: 700, fontSize: '14.5px', textDecoration: 'none',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <i className="fa-brands fa-instagram" style={{ fontSize: '18px' }}></i>
            View on Instagram
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {modal !== null && modalPost && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '6px', overflow: 'hidden',
              display: 'flex', maxWidth: '900px', width: '100%',
              maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            {/* Image side */}
            <div style={{ flex: '0 0 55%', background: '#000', position: 'relative', aspectRatio: '1/1', maxHeight: '90vh' }}>
              <img
                src={modalPost.src}
                alt="Instagram post"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
              {/* Prev/Next inside modal */}
              <button
                onClick={e => { e.stopPropagation(); setModal(m => Math.max(0, m - 1)) }}
                disabled={modal === 0}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)', border: 'none', cursor: modal === 0 ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                  opacity: modal === 0 ? 0.3 : 1
                }}
              ><i className="fa-solid fa-chevron-left"></i></button>
              <button
                onClick={e => { e.stopPropagation(); setModal(m => Math.min(total - 1, m + 1)) }}
                disabled={modal === total - 1}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)', border: 'none', cursor: modal === total - 1 ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                  opacity: modal === total - 1 ? 0.3 : 1
                }}
              ><i className="fa-solid fa-chevron-right"></i></button>
            </div>

            {/* Info side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
              {/* Profile header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #efefef', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, padding: '2px'
                }}>
                  <img
                    src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/05/logo-gigapixel-text-shapes-6x-scaled.png"
                    alt="Swaralaya"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid #fff' }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#262626' }}>swaralayamusicschool_nl</div>
                  <div style={{ fontSize: '12px', color: '#8e8e8e' }}>Swaralaya School of Music</div>
                </div>
                <a
                  href={modalPost.link}
                  target="_blank" rel="noopener noreferrer"
                  style={{ marginLeft: 'auto', fontSize: '13px', color: '#0095f6', fontWeight: 600, textDecoration: 'none' }}
                >Follow</a>
              </div>

              {/* Caption */}
              <p style={{ fontSize: '14px', color: '#262626', lineHeight: 1.7, flex: 1 }}>{modalPost.caption}</p>

              {/* Counter */}
              <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #efefef' }}>
                {modal + 1} / {total}
              </div>

              {/* View on Instagram */}
              <a
                href={modalPost.link}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center', marginTop: '16px',
                  background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
                  color: '#fff', padding: '10px 20px', borderRadius: '4px',
                  fontWeight: 700, fontSize: '13.5px', textDecoration: 'none'
                }}
              >
                View on Instagram
              </a>
            </div>

            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '14px', zIndex: 10
              }}
            ><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      )}
    </section>
  )
}

function EventSection() {
  const ref = useScrollAnimation()
  const { events, hasUpcomingEvents } = useUpcomingEvents()

  // Fully hide section, cards, and "View All Events" when no upcoming events
  if (!hasUpcomingEvents) {
    return null
  }

  const event = events[0]

  return (
    <section className="section event-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Upcoming Event</span>
          <h2 className="section-title">{event.title}</h2>
          <div className="section-divider" />
        </div>

        <div className="event-grid">
          <div className="event-image">
            {event.image ? (
              <img
                src={`http://localhost:3001${event.image}`}
                alt={event.title}
                loading="lazy"
              />
            ) : (
              <div className="event-image-placeholder">
                <i className="fa-solid fa-music" />
              </div>
            )}
          </div>

          <div className="event-details">
            <div className="event-meta">
              <div className="event-meta-item">
                <i className="fa-solid fa-calendar-days" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {event.time && (
                <div className="event-meta-item">
                  <i className="fa-solid fa-clock" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="event-meta-item">
                  <i className="fa-solid fa-location-dot" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="event-text">{event.description}</p>
            )}

            <Link to="/upcoming-event" className="theme-btn theme-btn-dark">
              View All Events <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useScrollAnimation()
  return (
    <section
      className="section"
      ref={ref}
      style={{
        background: 'var(--primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'url(https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/06/sheet-music-8464000_1280.jpg) center/cover no-repeat',
          opacity: 0.08,
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="fade-in">
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Ready to Begin Your Musical Journey?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.88)', marginBottom: '36px', maxWidth: 580, margin: '0 auto 36px' }}>
            Join hundreds of happy students at Swaralaya and discover the melody that lives within you.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/enroll-now" className="theme-btn theme-btn-outline" style={{ borderColor: '#fff' }}>
              Enroll Now <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link to="/contact" className="theme-btn" style={{ background: '#fff', color: 'var(--primary)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroVideo />
      {/* <StatStrip /> */}
      <AboutSection />
      <CoursesSection />
      <VideosSection />
      <EventSection />
      {/* <TestimonialsSection /> */}
      <InstagramSection />
      {/* <CTASection /> */}
    </>
  )
}
