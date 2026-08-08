import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// AdminLayout is the "shell" that wraps all admin pages.
// It provides:
//   - A fixed sidebar with navigation links
//   - The unread contacts badge that updates every 30 seconds
//   - The logout button
//   - The main content area where each admin page renders
export default function AdminLayout() {
  // This number shows how many unread contact messages exist
  // It is displayed as a red badge on the "Contacts" sidebar link
  const [unreadCount, setUnreadCount] = useState(0)

  // useNavigate lets us programmatically redirect to another page
  const navigate = useNavigate()

  // Run auth check and load unread count when the layout first mounts
  useEffect(() => {
    checkIfLoggedIn()
    refreshUnreadCount()

    // Re-check unread count every 30 seconds so the badge stays updated
    const refreshTimer = setInterval(refreshUnreadCount, 30000)

    // When the admin navigates away, stop the timer to avoid memory leaks
    return () => clearInterval(refreshTimer)
  }, [])

  // If no token exists in localStorage, redirect to the login page
  const checkIfLoggedIn = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
    }
  }

  // Fetch how many contact messages are unread from the backend
  const refreshUnreadCount = async () => {
    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch('http://localhost:3001/api/contacts/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Could not fetch unread message count:', error)
    }
  }

  // Clear the token and user info, then redirect to login
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  // Style for the active/selected sidebar navigation link
  const activeLinkStyle = {
    background: '#eae6e2',
    color: 'var(--brown)',
    fontWeight: '700'
  }

  // Shared base style for each sidebar nav link
  const navLinkBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#555',
    textDecoration: 'none',
    fontSize: '14.5px',
    transition: 'all 0.2s'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fcfbfa', fontFamily: 'var(--font-main)' }}>

      {/* ============================
          SIDEBAR (Fixed Left Panel)
          ============================ */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderRight: '1px solid #eae6e2',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Logo and portal title */}
        <div style={{ padding: '24px', borderBottom: '1px solid #eae6e2', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/05/swaralaya-logo.png"
            alt="Swaralaya School of Music"
            style={{ height: '40px', width: 'auto' }}
          />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--brown)', margin: 0 }}>Swaralaya</h3>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: '600' }}>ADMIN PORTAL</span>
          </div>
        </div>

        {/* Navigation links — NavLink highlights the active page automatically */}
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Dashboard link */}
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-chart-line"></i> Dashboard
          </NavLink>

          {/* Blogs management link */}
          <NavLink
            to="/admin/blogs"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-blog"></i> Manage Blogs
          </NavLink>

          {/* Enrollments link */}
          <NavLink
            to="/admin/enrollments"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-user-graduate"></i> Enrollments
          </NavLink>

          {/* Events management link */}
          <NavLink
            to="/admin/events"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-calendar-days"></i> Manage Events
          </NavLink>

          {/* Bookings management link */}
          <NavLink
            to="/admin/bookings"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-ticket"></i> Manage Bookings
          </NavLink>

          {/* Contacts link — shows a red badge if there are unread messages */}
          <NavLink
            to="/admin/contacts"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              justifyContent: 'space-between',
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fa-solid fa-envelope"></i> Contacts
            </div>
            {/* Only show the badge if there are unread messages */}
            {unreadCount > 0 && (
              <span style={{
                background: '#e50418',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>

          {/* SMTP Settings link */}
          <NavLink
            to="/admin/smtp-settings"
            style={({ isActive }) => ({
              ...navLinkBaseStyle,
              ...(isActive ? activeLinkStyle : {})
            })}
          >
            <i className="fa-solid fa-paper-plane"></i> SMTP Settings
          </NavLink>
        </nav>

        {/* Logout Button at the bottom of the sidebar */}
        <div style={{ padding: '16px', borderTop: '1px solid #eae6e2' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#fcfcfc',
              border: '1px solid #eae6e2',
              padding: '12px',
              borderRadius: '8px',
              color: '#e50418',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffebee'
              e.currentTarget.style.borderColor = '#ffcdd2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fcfcfc'
              e.currentTarget.style.borderColor = '#eae6e2'
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Log Out
          </button>
        </div>
      </aside>

      {/* ============================
          MAIN CONTENT AREA (Right Side)
          Each admin page renders inside <Outlet />
          We also pass the refreshUnreadCount function so child
          pages (like Contacts) can update the sidebar badge
          ============================ */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        <Outlet context={{ fetchUnreadCount: refreshUnreadCount }} />
      </main>
    </div>
  )
}
