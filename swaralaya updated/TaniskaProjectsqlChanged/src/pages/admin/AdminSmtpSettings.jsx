import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3001/api/smtp-config'

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #eae6e2',
  fontSize: '15px',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#555',
  display: 'block',
  marginBottom: '6px',
}

export default function AdminSmtpSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const [configured, setConfigured] = useState(false)

  const [host, setHost] = useState('')
  const [port, setPort] = useState('587')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('tls')
  const [fromEmail, setFromEmail] = useState('')
  const [fromName, setFromName] = useState('Swaralaya School of Music')
  const [adminEmails, setAdminEmails] = useState('')

  useEffect(() => {
    fetchSmtpConfig()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchSmtpConfig = async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load SMTP configuration.')
      }

      const data = await response.json()
      setConfigured(Boolean(data.configured))
      setHost(data.host || '')
      setPort(String(data.port || '587'))
      setUsername(data.username || '')
      setEncryption(data.encryption || 'tls')
      setFromEmail(data.from_email || '')
      setFromName(data.from_name || 'Swaralaya School of Music')
      setAdminEmails(Array.isArray(data.admin_emails) ? data.admin_emails.join('\n') : '')
      setHasPassword(Boolean(data.has_password))
      setPassword('')
    } catch (error) {
      console.error('Failed to load SMTP settings:', error)
      alert('Failed to load SMTP settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          host,
          port,
          username,
          password: password || undefined,
          encryption,
          from_email: fromEmail,
          from_name: fromName,
          admin_emails: adminEmails,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : (data.message || 'Failed to save SMTP settings.')
        throw new Error(message)
      }

      setConfigured(true)
      setHasPassword(true)
      setPassword('')
      alert(data.message || 'SMTP configuration saved successfully.')
      await fetchSmtpConfig()
    } catch (error) {
      console.error('Failed to save SMTP settings:', error)
      alert(error.message || 'Failed to save SMTP settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)

    try {
      const response = await fetch(`${API_BASE}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : (data.message || 'SMTP test failed.')
        throw new Error(message)
      }

      alert(data.message || 'Test email sent successfully.')
    } catch (error) {
      console.error('SMTP test failed:', error)
      alert(error.message || 'SMTP test failed.')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return <div style={{ color: '#666', padding: '20px' }}>Loading SMTP settings... please wait.</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brown)', margin: '0 0 8px' }}>
          SMTP Settings
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
          Configure SMTP settings for sending emails from the application.
        </p>
        {configured && (
          <p style={{ fontSize: '13px', color: '#2e7d32', margin: '8px 0 0' }}>
            SMTP configuration is active.
          </p>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #eae6e2', borderRadius: '16px', padding: '32px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>SMTP Host *</label>
              <input
                type="text"
                required
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="smtp.gmail.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>SMTP Port *</label>
              <select
                required
                value={port}
                onChange={(e) => setPort(e.target.value)}
                style={inputStyle}
              >
                <option value="465">465 (SSL)</option>
                <option value="587">587 (TLS)</option>
                <option value="25">25</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>SMTP Username (Email) *</label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-email@gmail.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>SMTP Password {hasPassword ? '' : '*'}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep existing"
                style={inputStyle}
              />
              <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0' }}>
                Leave blank to keep existing password
              </p>
            </div>

            <div>
              <label style={labelStyle}>Encryption *</label>
              <select
                required
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                style={inputStyle}
              >
                <option value="ssl">SSL</option>
                <option value="tls">TLS</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>From Email *</label>
              <input
                type="email"
                required
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="noreply@swaralayaschoolofmusic.nl"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>From Name *</label>
              <input
                type="text"
                required
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Swaralaya School of Music"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Admin Notification Emails</label>
              <textarea
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                rows={3}
                placeholder={'One email per line\nadmin@example.com'}
                style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
              />
              <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0' }}>
                One email address per line. The first address is used for SMTP test emails.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #eae6e2' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'var(--brown)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.8 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save SMTP Settings'}
            </button>

            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              style={{
                background: '#fcfcfc',
                color: '#555',
                border: '1px solid #eae6e2',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: testing ? 'not-allowed' : 'pointer',
                opacity: testing ? 0.8 : 1,
              }}
            >
              {testing ? 'Testing...' : 'Test SMTP Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
