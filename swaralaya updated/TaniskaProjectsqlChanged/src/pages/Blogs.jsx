import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Blogs() {
  const ref = useScrollAnimation()
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/blogs')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const mapped = data.map(b => ({
              title: b.title,
              date: new Date(b.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }),
              author: b.author || 'Swaralaya School of Music',
              image: b.coverImage ? `http://localhost:3001${b.coverImage}` : 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/08/Swaralayaa.png',
              slug: b.slug
            }))
            setBlogPosts(mapped)
          }
        }
      } catch (e) {
        console.warn('Backend blogs API not reachable.', e)
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  return (
    <>
      <section
        className="blogs-list-section"
        ref={ref}
        style={{
          background: '#f7f5f3',
          padding: '80px 0',
          minHeight: '100vh'
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "3rem", color: 'var(--brown)', fontFamily: 'var(--font-slab)', marginBottom: '40px' }}>Blogs</h1>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '16px', padding: '40px' }}>
              Loading blog posts...
            </div>
          ) : blogPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: 'var(--brown)', fontFamily: 'var(--font-slab)', marginBottom: '16px' }}>
                No Blog Posts Yet
              </h2>
              <p style={{ color: '#888', fontSize: '16px' }}>
                Blog posts will appear here once published from the admin panel.
              </p>
            </div>
          ) : (
            blogPosts.map((post, idx) => (
              <article
                key={idx}
                className="blog-list-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                  marginBottom: '40px',
                  border: '1px solid #eae6e2',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image Container with Absolute Date Badge */}
                <div
                  className="blog-image-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '380px',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <Link to={`/blogs/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </Link>
                  {/* Date Badge Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'var(--brown)',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 15px rgba(111,53,39,0.3)',
                      zIndex: 2
                    }}
                  >
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div style={{ padding: '24px 8px 8px' }}>
                  {/* Author */}
                  <div
                    style={{
                      fontSize: '14.5px',
                      color: '#888888',
                      marginBottom: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {post.author}
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      lineHeight: '1.35',
                      marginBottom: '20px',
                      fontFamily: 'var(--font-slab)'
                    }}
                  >
                    <Link
                      to={`/blogs/${post.slug}`}
                      style={{
                        color: '#1a1a1a',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brown)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#1a1a1a')}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Read More Button */}
                  <div>
                    <Link
                      to={`/blogs/${post.slug}`}
                      className="theme-btn"
                      style={{
                        background: 'var(--brown)',
                        color: '#ffffff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 24px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#5c2b20')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brown)')}
                    >
                      Read More <span style={{ fontSize: '11px' }}>↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  )
}