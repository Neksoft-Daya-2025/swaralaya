import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  // Store statistical counts for the dashboard cards
  const [stats, setStats] = useState({
    blogs: 0,
    totalEnrollments: 0,
    unreadContacts: 0
  })
  
  // Track loading state while loading statistics from backend API
  const [loading, setLoading] = useState(true)

  // Fetch count numbers from our NestJS backend endpoints
  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard statistics...');
      const token = localStorage.getItem('adminToken')
      
      // Pass JWT token in Authorization header
      const headers = { 'Authorization': `Bearer ${token}` }

      // Get blogs list
      const blogsRes = await fetch('http://localhost:3001/api/blogs?all=true', { headers })
      const blogs = await blogsRes.json()

      // Get enrollment stats (pending/accepted/rejected counts)
      const enrollStatsRes = await fetch('http://localhost:3001/api/enrollments/stats', { headers })
      const enrollStats = await enrollStatsRes.json()

      // Get unread contact message count
      const unreadRes = await fetch('http://localhost:3001/api/contacts/unread-count', { headers })
      const unread = await unreadRes.json()

      // Set counts state
      setStats({
        blogs: blogs.length,
        totalEnrollments: enrollStats.total,
        unreadContacts: unread.count
      })
    } catch (error) {
      console.log('Failed to fetch admin stats:', error)
    } finally {
      // Finished loading
      setLoading(false)
    }
  }

  // Load stats once on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ fontSize: '16px', color: '#666', padding: '20px' }}>
        Loading dashboard statistics... Please wait.
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
          Overview Dashboard
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
          Manage blog publications, approve enrollment applications, and read contact requests.
        </p>
      </div>

      {/* Stats Cards Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        
        {/* Card 1: Total Enrollments */}
        <div style={{
          background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 20px rgba(111,53,39,0.03)', display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>
              Total Enrollments
            </span>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: '#fff8f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brown)'
            }}>
              <i className="fa-solid fa-user-graduate" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--brown)', margin: 0 }}>
              {stats.totalEnrollments}
            </h2>
            <p style={{ fontSize: '14.5px', color: '#666', margin: '4px 0 0' }}>Total enrolled students</p>
          </div>
          <Link to="/admin/enrollments" style={{
            fontSize: '14px', color: 'var(--brown)', textDecoration: 'none', fontWeight: '700',
            marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}>
            View All →
          </Link>
        </div>

        {/* Card 2: Unread Contacts */}
        <div style={{
          background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 20px rgba(111,53,39,0.03)', display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>
              Unread Contacts
            </span>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: '#fff8f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brown)'
            }}>
              <i className="fa-solid fa-envelope" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--brown)', margin: 0 }}>
              {stats.unreadContacts}
            </h2>
            <p style={{ fontSize: '14.5px', color: '#666', margin: '4px 0 0' }}>New messages</p>
          </div>
          <Link to="/admin/contacts" style={{
            fontSize: '14px', color: 'var(--brown)', textDecoration: 'none', fontWeight: '700',
            marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}>
            Read Messages →
          </Link>
        </div>

        {/* Card 3: Total Blogs */}
        <div style={{
          background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 20px rgba(111,53,39,0.03)', display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>
              Published Blogs
            </span>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: '#fff8f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brown)'
            }}>
              <i className="fa-solid fa-blog" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--brown)', margin: 0 }}>
              {stats.blogs}
            </h2>
            <p style={{ fontSize: '14.5px', color: '#666', margin: '4px 0 0' }}>Total articles online</p>
          </div>
          <Link to="/admin/blogs" style={{
            fontSize: '14px', color: 'var(--brown)', textDecoration: 'none', fontWeight: '700',
            marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}>
            Write Article →
          </Link>
        </div>
      </div>
    </div>
  )
}
