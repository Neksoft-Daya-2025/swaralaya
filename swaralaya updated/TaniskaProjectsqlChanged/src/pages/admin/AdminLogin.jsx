import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// This is the login page for the admin dashboard.
// It sends the email and password to the backend,
// and if they match the .env credentials, it saves the JWT token.
export default function AdminLogin() {
  // State to hold what the admin types in the email and password inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // State for showing error messages if login fails
  const [loginError, setLoginError] = useState('')

  // State to disable the button while the login request is happening
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // useNavigate helps us redirect to another page after login
  const navigate = useNavigate()

  // This function runs when the admin clicks "Sign In"
  const handleLogin = async (event) => {
    // Prevent the browser from refreshing the page (default form submit behavior)
    event.preventDefault()

    // Clear any previous error messages
    setLoginError('')

    // Show loading state
    setIsLoggingIn(true)

    try {
      // Send the email and password to our NestJS backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Tell server we're sending JSON
        },
        body: JSON.stringify({ email, password }),  // Convert to JSON string
      })

      // Parse the response JSON
      const responseData = await response.json()

      // If login failed (e.g., wrong password), throw an error
      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed. Please check your credentials.')
      }

      // Save the JWT token so we can use it in other admin pages
      localStorage.setItem('adminToken', responseData.access_token)
      localStorage.setItem('adminUser', JSON.stringify(responseData.user))

      // Redirect to the admin dashboard
      navigate('/admin/dashboard')

    } catch (error) {
      // Show the error message to the admin
      setLoginError(error.message || 'Something went wrong. Try again.')
    } finally {
      // Always re-enable the button after request completes
      setIsLoggingIn(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f5f3',
      fontFamily: 'var(--font-main)',
      padding: '20px'
    }}>
      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(111,53,39,0.08)',
        border: '1px solid #eae6e2',
        padding: '40px 32px',
        textAlign: 'center'
      }}>
        {/* School logo and title */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2025/05/swaralaya-logo.png"
            alt="Swaralaya School of Music Logo"
            style={{ height: '60px', width: 'auto' }}
          />
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--brown)', marginTop: '16px', marginBottom: '4px' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
            Sign in to manage Swaralaya School
          </p>
        </div>

        {/* Error alert — only shows when there is an error */}
        {loginError && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13.5px',
            marginBottom: '20px',
            textAlign: 'left',
            border: '1px solid #ffcdd2'
          }}>
            ⚠️ {loginError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>

          {/* Email Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@swaralaya.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #eae6e2',
                fontSize: '14.5px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brown)'}
              onBlur={(e) => e.target.style.borderColor = '#eae6e2'}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#555', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #eae6e2',
                fontSize: '14.5px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brown)'}
              onBlur={(e) => e.target.style.borderColor = '#eae6e2'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: '100%',
              background: 'var(--brown)',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: isLoggingIn ? 0.8 : 1
            }}
            onMouseEnter={(e) => { if (!isLoggingIn) e.currentTarget.style.background = '#5c2b20' }}
            onMouseLeave={(e) => { if (!isLoggingIn) e.currentTarget.style.background = 'var(--brown)' }}
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
