import { useEffect, useState } from 'react'

// This page lets the admin create, edit, and delete blog posts.
// Each blog post can have:
//   - A title, short intro text, cover image, category, author
//   - Multiple "layout sections" that appear in the full "Read More" view
//     Each section can have: heading, subheading, body text, and an image
export default function AdminBlogs() {
  // List of all blog posts loaded from the backend
  const [blogs, setBlogs] = useState([])

  // Whether we are in "form editing" mode or "listing" mode
  const [isEditing, setIsEditing] = useState(false)

  // Loading state while fetching the initial blog list
  const [loading, setLoading] = useState(true)

  // Saving state while the form is being submitted
  const [saving, setSaving] = useState(false)
  // Tracks which submit button was clicked (Publish vs Draft) — more reliable than submitter
  const [pendingPublishAction, setPendingPublishAction] = useState(null)

  // -------------------------------------------------------
  // Form fields — these values get sent to the backend API
  // -------------------------------------------------------
  const [blogId, setBlogId] = useState(null)                        // null = new blog, string = editing existing
  const [title, setTitle] = useState('')                             // Blog article title
  const [content, setContent] = useState('')                         // Short intro/excerpt text
  const [category, setCategory] = useState('General & Tips')        // Blog category
  const [author, setAuthor] = useState('Swaralaya School of Music') // Author name
  const [published, setPublished] = useState(true)                   // true = visible on site
  const [bulletStyle, setBulletStyle] = useState('checkmark')        // 'checkmark' | 'plain'
  const [coverImageFile, setCoverImageFile] = useState(null)         // Cover image file object

  // Sections: an array of content blocks that appear inside the full article
  // Each section has: title, subheading, content, image, imagePosition, imageHeight, imageWidth, hideBullets
  const [sections, setSections] = useState([])

  // --------------------------------
  // Load blogs when page first loads
  // --------------------------------
  useEffect(() => {
    fetchAllBlogs()
  }, [])

  // Fetch all blog posts from the backend
  const fetchAllBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch('http://localhost:3001/api/blogs?all=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Failed to load blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Open the form in "editing" mode — pre-fill with existing blog data
  const startEditingBlog = (blog) => {
    setBlogId(blog._id || blog.id)
    setTitle(blog.title)
    setContent(blog.content)
    setCategory(blog.category || 'General & Tips')
    setAuthor(blog.author || 'Swaralaya School of Music')
    setPublished(blog.published)
    setBulletStyle(blog.bulletStyle || 'checkmark')
    setSections(blog.sections || [])
    setCoverImageFile(null)  // Reset file input
    setIsEditing(true)
  }

  // Open the form in "new blog" mode — reset all fields
  const startCreatingNewBlog = () => {
    setBlogId(null)
    setTitle('')
    setContent('')
    setCategory('General & Tips')
    setAuthor('Swaralaya School of Music')
    setPublished(true)
    setBulletStyle('checkmark')
    setSections([])
    setCoverImageFile(null)
    setIsEditing(true)
  }

  // Cancel editing and go back to the blogs list
  const cancelEditing = () => {
    setIsEditing(false)
  }

  // Delete a blog post after confirmation
  const deleteBlog = async (id) => {
    const blogIdToDelete = String(id || '')
    if (!blogIdToDelete) {
      alert('Could not delete: missing blog id.')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this blog post? This cannot be undone.')
    if (!confirmed) return

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('You are not logged in. Please log in again, then try deleting.')
        return
      }

      const response = await fetch(`http://localhost:3001/api/blogs/${blogIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => String(blog._id || blog.id) !== blogIdToDelete)
        )
        await fetchAllBlogs()
      } else if (response.status === 401) {
        alert('Session expired or unauthorized. Please log in again and retry.')
      } else if (response.status === 404) {
        alert('Blog post not found. It may have already been deleted.')
        await fetchAllBlogs()
      } else {
        let detail = ''
        try {
          const errBody = await response.json()
          detail = errBody?.message
            ? (Array.isArray(errBody.message) ? errBody.message.join(', ') : String(errBody.message))
            : ''
        } catch (_) { /* ignore */ }
        alert(detail || `Failed to delete blog (error ${response.status}).`)
      }
    } catch (error) {
      console.error('Failed to delete blog:', error)
      alert('Could not reach the backend. Make sure it is running on http://localhost:3001.')
    }
  }

  // -----------------------------------------------
  // Section Management (for the "Read More" layout)
  // -----------------------------------------------

  // Add a new blank section at the bottom of the sections list
  const addNewSection = () => {
    const blankSection = {
      title: '',
      subheading: '',
      content: '',
      image: '',
      imagePosition: 'left',
      imageHeight: 220,
      imageWidth: 50,
      galleryImages: [],
      hideBullets: false,
    }
    setSections((currentSections) => [...currentSections, blankSection])
  }

  // Remove a section by its index position in the array
  const removeSection = (sectionIndex) => {
    setSections((currentSections) => {
      return currentSections.filter((_, index) => index !== sectionIndex)
    })
  }

  // Update a single field inside a specific section
  const updateSectionField = (sectionIndex, fieldName, newValue) => {
    // Make a copy of the sections so we don't modify state directly
    const updatedSections = [...sections]
    updatedSections[sectionIndex][fieldName] = newValue
    setSections(updatedSections)
  }

  // Move a section up or down in the list (for reordering)
  const moveSectionPosition = (sectionIndex, direction) => {
    const isFirst = sectionIndex === 0
    const isLast = sectionIndex === sections.length - 1

    // Can't move up if already at the top
    if (direction === 'up' && isFirst) return

    // Can't move down if already at the bottom
    if (direction === 'down' && isLast) return

    const updatedSections = [...sections]

    // Swap this section with the one above or below it
    const swapWithIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1
    const temp = updatedSections[sectionIndex]
    updatedSections[sectionIndex] = updatedSections[swapWithIndex]
    updatedSections[swapWithIndex] = temp

    setSections(updatedSections)
  }

  // Upload an image for a specific section and save its URL
  const uploadSectionImage = async (sectionIndex, imageFile) => {
    if (!imageFile) return

    const token = localStorage.getItem('adminToken')

    // FormData is how we send files over HTTP
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch('http://localhost:3001/api/blogs/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        // Save the returned image URL into the section
        updateSectionField(sectionIndex, 'image', data.url)
      } else {
        alert('Image upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading section image:', error)
      alert('Network error during image upload.')
    }
  }

  // Upload a gallery image into one of 4 slots on a section
  const uploadSectionGalleryImage = async (sectionIndex, slotIndex, imageFile) => {
    if (!imageFile || slotIndex < 0 || slotIndex > 3) return

    const token = localStorage.getItem('adminToken')
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch('http://localhost:3001/api/blogs/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setSections((currentSections) => {
          const updated = [...currentSections]
          const slots = Array.from({ length: 4 }, (_, i) => updated[sectionIndex]?.galleryImages?.[i] || '')
          slots[slotIndex] = data.url
          updated[sectionIndex] = {
            ...updated[sectionIndex],
            galleryImages: slots.filter(Boolean),
          }
          return updated
        })
      } else {
        alert('Gallery image upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error)
      alert('Network error during gallery image upload.')
    }
  }

  const removeSectionGalleryImage = (sectionIndex, slotIndex) => {
    setSections((currentSections) => {
      const updated = [...currentSections]
      const current = [...(updated[sectionIndex]?.galleryImages || [])]
      current.splice(slotIndex, 1)
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        galleryImages: current,
      }
      return updated
    })
  }

  // Submit the form to create or update a blog post
  const submitBlogForm = async (event) => {
    event.preventDefault()
    setSaving(true)

    // Prefer the action from the clicked button (set in onClick). Fall back to submitter, then current state.
    const submitter = event.nativeEvent?.submitter
    const submitterAction = submitter?.value
    const action = pendingPublishAction || submitterAction
    const shouldPublish =
      action === 'publish' ? true :
      action === 'draft' ? false :
      !!published

    setPublished(shouldPublish)
    setPendingPublishAction(null)

    // FormData is used because we may also be uploading a cover image file
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category)
    formData.append('author', author)
    formData.append('published', String(shouldPublish))
    formData.append('bulletStyle', bulletStyle)

    // Sections must be sent as a JSON string because FormData only supports plain text values
    formData.append('sections', JSON.stringify(sections))

    // Only include cover image if a new file was selected
    if (coverImageFile) {
      formData.append('coverImage', coverImageFile)
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('You are not logged in. Please log in again, then try publishing.')
        return
      }

      // If blogId exists, update existing blog (PUT). Otherwise, create new (POST).
      const requestUrl = blogId
        ? `http://localhost:3001/api/blogs/${blogId}`
        : 'http://localhost:3001/api/blogs'

      const requestMethod = blogId ? 'PUT' : 'POST'

      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        // Close the form and reload the blog list
        setIsEditing(false)
        fetchAllBlogs()
      } else {
        let detail = ''
        try {
          const errBody = await response.json()
          detail = errBody?.message
            ? (Array.isArray(errBody.message) ? errBody.message.join(', ') : String(errBody.message))
            : ''
        } catch (_) {
          /* ignore parse errors */
        }
        if (response.status === 401) {
          alert('Session expired or unauthorized. Please log in again and retry.')
        } else if (response.status === 409 || /duplicate|ER_DUP_ENTRY|unique/i.test(detail)) {
          alert('A blog with this title (or slug) already exists. Change the title and try again.')
        } else {
          alert(detail || `Failed to save the blog post (error ${response.status}). Please check the fields and try again.`)
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Could not reach the backend. Make sure it is running on http://localhost:3001.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ color: '#666', padding: '20px' }}>Loading blog posts... please wait.</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
            Manage Blog Publications
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            Create and edit articles that display on the public Swaralaya news section.
          </p>
        </div>

        {/* Only show the "Write Article" button when not editing */}
        {!isEditing && (
          <button
            onClick={startCreatingNewBlog}
            style={{
              background: 'var(--brown)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-plus"></i> Write Article
          </button>
        )}
      </div>

      {/* Show either the EDITING FORM or the BLOGS LIST */}
      {isEditing ? (

        // =============================================
        // EDITING FORM — Create or Edit a blog post
        // =============================================
        <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--brown)', marginTop: 0, marginBottom: '24px' }}>
            {blogId ? 'Edit Article' : 'Write New Article'}
          </h2>

          <form onSubmit={submitBlogForm}>
            {/* Two-column layout: left side = main content, right side = settings */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>

              {/* LEFT COLUMN: Title, Content, Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Article Title */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Main Article Intro Text */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Article Content (Intro / Excerpt)
                  </label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type the main article content or introductory excerpt here..."
                    rows={6}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {/* -----------------------------------------------
                    LAYOUT SECTIONS — Content blocks for "Read More"
                    ----------------------------------------------- */}
                <div style={{ borderTop: '1px solid #eae6e2', paddingTop: '24px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brown)', margin: '0 0 4px' }}>
                        Read More Layout Sections
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                        Sections appear inside the full article view. Add images + text for alternating side-by-side layouts.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addNewSection}
                      style={{
                        background: '#fff',
                        border: '1px solid var(--brown)',
                        color: 'var(--brown)',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brown)'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--brown)' }}
                    >
                      <i className="fa-solid fa-folder-plus"></i> Add Section
                    </button>
                  </div>

                  {/* Empty state when no sections added yet */}
                  {sections.length === 0 ? (
                    <div style={{
                      padding: '24px',
                      border: '2px dashed #eae6e2',
                      borderRadius: '12px',
                      textAlign: 'center',
                      color: '#888',
                      fontSize: '14px'
                    }}>
                      No extra sections added yet. Readers will only see the main intro text.<br />
                      Click "Add Section" to add multiple heading blocks, descriptions, and inline images.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {sections.map((section, sectionIdx) => (
                        <div
                          key={sectionIdx}
                          style={{
                            background: '#fcfbfa',
                            border: '1px solid #eae6e2',
                            borderRadius: '12px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                          }}
                        >
                          {/* Section controls: number label + move up/down + delete */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--brown)' }}>
                              Section #{sectionIdx + 1}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {/* Move up button */}
                              <button
                                type="button"
                                onClick={() => moveSectionPosition(sectionIdx, 'up')}
                                disabled={sectionIdx === 0}
                                title="Move section up"
                                style={{
                                  background: '#fff',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  cursor: sectionIdx === 0 ? 'default' : 'pointer',
                                  opacity: sectionIdx === 0 ? 0.4 : 1
                                }}
                              >▲</button>

                              {/* Move down button */}
                              <button
                                type="button"
                                onClick={() => moveSectionPosition(sectionIdx, 'down')}
                                disabled={sectionIdx === sections.length - 1}
                                title="Move section down"
                                style={{
                                  background: '#fff',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  cursor: sectionIdx === sections.length - 1 ? 'default' : 'pointer',
                                  opacity: sectionIdx === sections.length - 1 ? 0.4 : 1
                                }}
                              >▼</button>

                              {/* Delete section button */}
                              <button
                                type="button"
                                onClick={() => removeSection(sectionIdx)}
                                title="Remove this section"
                                style={{
                                  background: '#ffebee',
                                  border: '1px solid #ffcdd2',
                                  borderRadius: '4px',
                                  padding: '4px 10px',
                                  color: '#c62828',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >Delete</button>
                            </div>
                          </div>

                          {/* Section fields: heading + subheading on left, image on right */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                            {/* Left: Heading and Subheading */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                  Section Heading
                                </label>
                                <input
                                  type="text"
                                  value={section.title || ''}
                                  onChange={(e) => updateSectionField(sectionIdx, 'title', e.target.value)}
                                  placeholder="e.g. Course Curriculum Overview"
                                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', boxSizing: 'border-box' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                  Section Subheading (optional)
                                </label>
                                <input
                                  type="text"
                                  value={section.subheading || ''}
                                  onChange={(e) => updateSectionField(sectionIdx, 'subheading', e.target.value)}
                                  placeholder="e.g. Structure & timings"
                                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', boxSizing: 'border-box' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                  Image Position
                                </label>
                                <select
                                  value={section.imagePosition || 'left'}
                                  onChange={(e) => updateSectionField(sectionIdx, 'imagePosition', e.target.value)}
                                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                                >
                                  <option value="left">Left</option>
                                  <option value="right">Right</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                  Bullets
                                </label>
                                <select
                                  value={section.hideBullets ? 'hide' : 'show'}
                                  onChange={(e) => updateSectionField(sectionIdx, 'hideBullets', e.target.value === 'hide')}
                                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                                >
                                  <option value="show">Show</option>
                                  <option value="hide">Hide</option>
                                </select>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                    Image Height (px)
                                  </label>
                                  <input
                                    type="number"
                                    min={100}
                                    max={800}
                                    value={section.imageHeight ?? 220}
                                    onChange={(e) => updateSectionField(sectionIdx, 'imageHeight', Number(e.target.value) || 220)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', boxSizing: 'border-box' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                    Image Width (%)
                                  </label>
                                  <input
                                    type="number"
                                    min={30}
                                    max={70}
                                    value={section.imageWidth ?? 50}
                                    onChange={(e) => {
                                      const raw = Number(e.target.value)
                                      const clamped = Number.isFinite(raw)
                                        ? Math.min(70, Math.max(30, raw))
                                        : 50
                                      updateSectionField(sectionIdx, 'imageWidth', clamped)
                                    }}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', boxSizing: 'border-box' }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right: Section Image upload */}
                            <div>
                              <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                                Section Image (optional)
                              </label>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => uploadSectionImage(sectionIdx, e.target.files[0])}
                                  style={{ fontSize: '12px' }}
                                />
                                {/* Show thumbnail preview if image already uploaded */}
                                {section.image && (
                                  <img
                                    src={`http://localhost:3001${section.image}`}
                                    alt="Section image preview"
                                    style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                                  />
                                )}
                              </div>
                              <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0' }}>
                                If both image and text are added, they appear side-by-side in the article.
                              </p>
                            </div>
                          </div>

                          {/* Section body text */}
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                              Section Content (paragraphs / multi-line description)
                            </label>
                            <textarea
                              value={section.content || ''}
                              onChange={(e) => updateSectionField(sectionIdx, 'content', e.target.value)}
                              placeholder="Write detailed paragraphs for this section..."
                              rows={5}
                              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eae6e2', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                          </div>

                          {/* Gallery Images (up to 4) — separate from Section Image */}
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '8px' }}>
                              Gallery Images (up to 4)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                              {[0, 1, 2, 3].map((slotIndex) => {
                                const galleryUrl = (section.galleryImages || [])[slotIndex]
                                return (
                                  <div
                                    key={slotIndex}
                                    style={{
                                      border: '1px solid #eae6e2',
                                      borderRadius: '8px',
                                      padding: '10px',
                                      background: '#fafafa',
                                    }}
                                  >
                                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 6px', fontWeight: '600' }}>
                                      Image {slotIndex + 1}
                                    </p>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      disabled={(section.galleryImages || []).length >= 4 && !galleryUrl}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        // If slot empty, append at end; if occupied, replace that index
                                        const current = section.galleryImages || []
                                        const targetIndex = galleryUrl
                                          ? slotIndex
                                          : Math.min(current.length, 3)
                                        uploadSectionGalleryImage(sectionIdx, targetIndex, file)
                                        e.target.value = ''
                                      }}
                                      style={{ fontSize: '11px', width: '100%' }}
                                    />
                                    {galleryUrl && (
                                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <img
                                          src={`http://localhost:3001${galleryUrl}`}
                                          alt={`Gallery ${slotIndex + 1}`}
                                          style={{
                                            width: '100%',
                                            height: '56px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeSectionGalleryImage(sectionIdx, slotIndex)}
                                          style={{
                                            fontSize: '11px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid #eae6e2',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            color: '#b71c1c',
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            <p style={{ fontSize: '11px', color: '#999', margin: '8px 0 0' }}>
                              Optional photo strip shown below this section. Separate from the main section image.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Category, Author, Cover Image, Publish Toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Category Dropdown */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="Carnatic Vocal">Carnatic Vocal</option>
                    <option value="Instruments">Instruments</option>
                    <option value="General & Tips">General & Tips</option>
                    <option value="Music Theory">Music Theory</option>
                  </select>
                </div>

                {/* Bullet Style Dropdown */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Bullet Style
                  </label>
                  <select
                    value={bulletStyle}
                    onChange={(e) => setBulletStyle(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="checkmark">Checkmark</option>
                    <option value="plain">Plain</option>
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eae6e2', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Cover Image File Upload */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
                    Cover Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    style={{ fontSize: '14px' }}
                  />
                  <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0' }}>
                    This image appears as the blog card thumbnail and article banner.
                  </p>
                </div>

              </div>
            </div>

            {/* Form action buttons at the bottom */}
            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #eae6e2', paddingTop: '24px', marginTop: '32px', alignItems: 'center' }}>
              
              {/* Publish Article Button (Primary Submit) */}
              <button
                type="submit"
                name="action"
                value="publish"
                disabled={saving}
                onClick={() => setPendingPublishAction('publish')}
                style={{
                  background: 'var(--brown)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.8 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-globe"></i> {saving && published ? 'Publishing...' : 'Publish Article'}
              </button>

              {/* Save as Draft Button (Secondary Submit) */}
              <button
                type="submit"
                name="action"
                value="draft"
                disabled={saving}
                onClick={() => setPendingPublishAction('draft')}
                style={{
                  background: '#fcfbfa',
                  color: '#455a64',
                  border: '1px solid #cfd8dc',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.8 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-file-pen"></i> {saving && !published ? 'Saving...' : 'Save as Draft'}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={cancelEditing}
                style={{
                  background: '#f5f5f5',
                  color: '#555',
                  border: '1px solid #eae6e2',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto'
                }}
              >
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
            </div>
          </form>
        </div>

      ) : (

        // ============================================
        // BLOG LISTING TABLE — show all existing blogs
        // ============================================
        <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
            <thead>
              <tr style={{ background: '#fcfbfa', borderBottom: '1px solid #eae6e2' }}>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Cover</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Title</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Category</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#555', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Show empty state when no blogs exist */}
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                    No blog posts written yet. Click "Write Article" to start.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => {
                  const blogItemId = blog._id || blog.id

                  return (
                    <tr key={blogItemId} style={{ borderBottom: '1px solid #eae6e2' }}>

                      {/* Cover Image Thumbnail */}
                      <td style={{ padding: '16px 24px' }}>
                        {blog.coverImage ? (
                          <img
                            src={`http://localhost:3001${blog.coverImage}`}
                            alt={`Cover for ${blog.title}`}
                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{
                            width: '60px',
                            height: '40px',
                            background: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: '#999',
                            borderRadius: '4px'
                          }}>
                            No Img
                          </div>
                        )}
                      </td>

                      {/* Blog Title */}
                      <td style={{ padding: '16px 24px', fontWeight: '700', color: '#333' }}>
                        {blog.title}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px 24px', color: '#666' }}>
                        {blog.category}
                      </td>

                      {/* Published / Draft badge */}
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          background: blog.published ? '#e8f5e9' : '#eceff1',
                          color: blog.published ? '#2e7d32' : '#455a64',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Date created */}
                      <td style={{ padding: '16px 24px', color: '#888' }}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>

                      {/* Edit and Delete buttons */}
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => startEditingBlog(blog)}
                          style={{ background: 'none', border: 'none', color: '#0288d1', cursor: 'pointer', fontWeight: '700', marginRight: '16px' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            deleteBlog(blogItemId)
                          }}
                          style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
