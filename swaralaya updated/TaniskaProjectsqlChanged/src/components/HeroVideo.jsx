import { useState, useEffect } from 'react'

export default function HeroVideo() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="hero-video-section">
      <video
        key={isMobile ? 'mobile' : 'desktop'}
        src={isMobile ? '/herSectionVideo.mp4' : '/swaralaya-slider-2.mp4'}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  )
}