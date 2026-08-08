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

export default function Benefits() {
  const ref = useScrollAnimation()

  const items = [
    {
      icon: 'fa-compact-disc',
      title: 'Frequent exposure through performances and video albums',
      desc: 'At Swaralaya we give you the chance to shine in your musical journey through Swarakshara, our annual day, in a theatre environment accompanied by eminent artists.'
    },
    {
      icon: 'fa-music',
      title: 'Step-by-step guidance',
      desc: 'You will progress in your musical journey in a step-by-step, structured, and systematic manner, with your dedicated teacher by your side at every stage, offering constant support, guidance, and encouragement throughout.'
    },
    {
      icon: 'fa-award',
      title: 'Bridging the gap between knowledge and certification',
      desc: 'In case you wish to get a certificate, we will provide you adequate training and preparation based on the syllabus, that are prescribed by the established boards.'
    },
    {
      icon: 'fa-sliders',
      title: 'Reconnecting with cultural roots',
      desc: 'Exploring traditional music helps revive heritage, preserve timeless melodies, and foster a deep sense of identity, allowing individuals to embrace their origins and celebrate the richness of ancestral art forms.'
    }
  ]

  return (
    <>
      <PageBanner title="Benefits" breadcrumb="Benefits" />
      <section
        className="benefits-page-section"
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '80vh',
          background: 'url(/bg2.webp) center/cover no-repeat',
          padding: '80px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container" style={{ zIndex: 2, width: '100%' }}>
          {/* Title */}
          <h1
            style={{
              fontSize: '34px',
              fontWeight: '700',
              color: 'var(--brown)',
              textAlign: 'center',
              marginBottom: '50px',
              fontFamily: 'var(--font-slab)'
            }}
          >
            Benefits of Swaralaya
          </h1>

          {/* 4 Cards Grid */}
          <div
            className="benefits-grid-overlay"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginBottom: '44px'
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="benefit-white-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '36px 24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #eae6e2'
                }}
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: '66px',
                    height: '66px',
                    borderRadius: '50%',
                    border: '1px solid #eae6e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '24px', color: 'var(--brown)' }}></i>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '16.5px',
                    fontWeight: '700',
                    color: '#222222',
                    lineHeight: '1.4',
                    marginBottom: '16px',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.title}
                </h3>

                {/* Desc */}
                <p style={{ color: '#666666', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Enroll Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </section>
    </>
  )
}
