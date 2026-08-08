import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUpcomingEvents } from '../hooks/useUpcomingEvents'

const baseNavItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Courses', path: '/courses' },
  { label: 'Benefits', path: '/benefits' },
  { label: 'Videos', path: '/video' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { hasUpcomingEvents } = useUpcomingEvents()

  const navItems = hasUpcomingEvents
    ? [
        ...baseNavItems.slice(0, 4),
        { label: 'Upcoming Event', path: '/upcoming-event' },
        ...baseNavItems.slice(4),
      ]
    : baseNavItems

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      {/* Main Header */}
      <header className={`header-area${scrolled ? ' scrolled' : ''}${location.pathname === '/' ? ' is-home' : ''}`}>
        <div className="container">
          <nav className="navbar">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <img
                src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/05/swaralaya-logo.png"
                alt="Swaralaya School of Music"
                loading="eager"
              />
            </Link>

            {/* Desktop Nav */}
            <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
              {navItems.map(item => (
                <li key={item.label} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    end={item.path === '/'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item">
                <Link to="/enroll-now" className="nav-link btn-enroll">
                  Enroll Now
                </Link>
              </li>
            </ul>

            {/* Mobile Toggle */}
            <button
              className={`nav-toggle${menuOpen ? ' active' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}
