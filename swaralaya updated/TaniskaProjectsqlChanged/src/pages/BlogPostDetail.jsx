import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1 className="blog-banner-heading">{title}</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blogs">Blogs</Link>
          <span>/</span>
          <span className="blog-banner-crumb">{breadcrumb}</span>
        </div>
      </div>
    </div>
  )
}

export default function BlogPostDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/blogs`)
        if (res.ok) {
          const data = await res.json()
          const found = data.find(b => b.slug === slug)
          if (found) {
            setPost({
              title: found.title,
              image: found.coverImage ? `http://localhost:3001${found.coverImage}` : 'https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/08/Swaralayaa.png',
              author: found.author || 'Swaralaya School of Music',
              content: found.content,
              sections: found.sections || [],
              bulletStyle: found.bulletStyle || 'checkmark',
            })
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.warn('Backend blogs API not reachable.', e)
      }

      setPost(null)
      setLoading(false)
    }

    window.scrollTo(0, 0)
    loadPost()
  }, [slug])

  if (loading) {
    return (
      <section className="blog-detail-page blog-detail-page--loading">
        <div className="blog-detail-loading">Loading article details...</div>
      </section>
    )
  }

  if (!post) {
    return (
      <>
        <PageBanner title="Post Not Found" breadcrumb="Error" />
        <section className="blog-detail-page blog-detail-page--empty">
          <div className="blog-detail-empty">
            <h2>Oops! Blog post not found.</h2>
            <p>The post you are looking for does not exist or has been moved.</p>
            <Link to="/blogs" className="theme-btn btn-enroll">Back to Blogs</Link>
          </div>
        </section>
      </>
    )
  }

  const getSectionRichContentClass = (section) => {
    const classes = ['blog-rich-content']
    if (post.bulletStyle === 'plain') classes.push('plain-bullets')
    if (section.hideBullets) classes.push('no-bullets')
    return classes.join(' ')
  }

  return (
    <>
      <PageBanner title={post.title} breadcrumb={post.title} />

      <section className="blog-detail-page">
        <div className="blog-detail-wrap">
          <article className="blog-detail-article">
            <div className="blog-feature-image">
              <img src={post.image} alt={post.title} />
            </div>

            <h1 className="blog-detail-title">{post.title}</h1>

            <div className="blog-detail-meta" style={{ marginBottom: '16px' }}>
              <span>By {post.author || 'Swaralaya School of Music'}</span>
              <span aria-hidden="true">•</span>
              <span>Published Articles</span>
            </div>

            <div className="blog-detail-body">
              <div
                className={`blog-rich-content ${post.bulletStyle === 'plain' ? 'plain-bullets' : ''}`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />

              {post.sections && post.sections.map((section, idx) => {
                const hasImage = !!section.image
                const hasText = !!section.content
                const imgWidth = Number(section.imageWidth) || 50
                const imageOnRight = section.imagePosition === 'right'
                const gridTemplateColumns = imageOnRight
                  ? `${100 - imgWidth}% ${imgWidth}%`
                  : `${imgWidth}% ${100 - imgWidth}%`
                const imgMaxHeight = `${section.imageHeight || 220}px`

                return (
                  <div
                    key={idx}
                    className="blog-section-block"
                    style={
                      idx === 0
                        ? { marginTop: '12px', borderTop: 'none', paddingTop: '0px' }
                        : { marginTop: '40px', borderTop: '1px solid #eae6e2', paddingTop: '32px' }
                    }
                  >
                    {section.title && <h3>{section.title}</h3>}
                    {section.subheading && <h4>{section.subheading}</h4>}

                    {hasImage && hasText ? (
                      <div
                        className="blog-section-grid"
                        style={{
                          gridTemplateColumns,
                          alignItems: 'flex-start',
                        }}
                      >
                        {imageOnRight ? (
                          <>
                            <div className="blog-section-text">
                              <div
                                className={getSectionRichContentClass(section)}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                              />
                            </div>
                            <div className="blog-section-img" style={{ maxHeight: imgMaxHeight }}>
                              <img
                                src={`http://localhost:3001${section.image}`}
                                alt={section.title || 'Section illustration'}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="blog-section-img" style={{ maxHeight: imgMaxHeight }}>
                              <img
                                src={`http://localhost:3001${section.image}`}
                                alt={section.title || 'Section illustration'}
                              />
                            </div>
                            <div className="blog-section-text">
                              <div
                                className={getSectionRichContentClass(section)}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="blog-section-full">
                        {hasImage && (
                          <div className="blog-section-full-img">
                            <img
                              src={`http://localhost:3001${section.image}`}
                              alt={section.title || 'Section illustration'}
                            />
                          </div>
                        )}
                        {hasText && (
                          <div
                            className={getSectionRichContentClass(section)}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                          />
                        )}
                      </div>
                    )}

                    {section.galleryImages && section.galleryImages.length > 0 && (
                      <div className="blog-gallery-grid">
                        {section.galleryImages.map((gallerySrc, galleryIdx) => (
                          <div key={galleryIdx} className="blog-gallery-item">
                            <img
                              src={`http://localhost:3001${gallerySrc}`}
                              alt={`${section.title || 'Section'} gallery ${galleryIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </article>

          <div className="blog-comment-box">
            <h3 className="blog-comment-title">Leave a Reply</h3>
            <p className="blog-comment-note">
              Your email address will not be published. Required fields are marked *
            </p>

            <form className="blog-comment-form" onSubmit={e => e.preventDefault()}>
              <div className="blog-comment-field">
                <label htmlFor="blog-comment">Comment *</label>
                <textarea
                  id="blog-comment"
                  required
                  rows="6"
                  placeholder="Write your comment here..."
                />
              </div>

              <div className="blog-comment-fields">
                <div className="blog-comment-field">
                  <label htmlFor="blog-name">Name *</label>
                  <input id="blog-name" type="text" required placeholder="Your Name" />
                </div>
                <div className="blog-comment-field">
                  <label htmlFor="blog-email">Email *</label>
                  <input id="blog-email" type="email" required placeholder="Your Email" />
                </div>
              </div>

              <div className="blog-comment-field">
                <label htmlFor="blog-website">Website</label>
                <input id="blog-website" type="url" placeholder="Your Website URL" />
              </div>

              <div className="blog-comment-save">
                <input type="checkbox" id="save-info" />
                <label htmlFor="save-info">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <div className="blog-comment-actions">
                <button type="submit" className="theme-btn blog-comment-submit">
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
