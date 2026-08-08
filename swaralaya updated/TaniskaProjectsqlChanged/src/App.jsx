import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// import BackToTop from './components/BackToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import Vocals from './pages/Vocals'
import Instruments from './pages/Instruments'
import Benefits from './pages/Benefits'
import Events from './pages/Events'
import Videos from './pages/Videos'
import Blogs from './pages/Blogs'
import BlogPostDetail from './pages/BlogPostDetail'
import Contact from './pages/Contact'
import EnrollNow from './pages/EnrollNow'
import PaymentConfirmation from './pages/PaymentConfirmation'

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminEvents from './pages/admin/AdminEvents'
import AdminBookings from './pages/admin/AdminBookings'
import AdminEnrollments from './pages/admin/AdminEnrollments'
import AdminContacts from './pages/admin/AdminContacts'
import AdminSmtpSettings from './pages/admin/AdminSmtpSettings'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Preloader transition states
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  // Listen to route changes
  useEffect(() => {
    setIsLoading(true)
    setShouldRender(true)

    // Keep loader active for 3000ms (3 seconds), then trigger fade-out transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // Unmount loader from DOM after transition completes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 800) // matches transition duration (0.8s) in index.css
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      {shouldRender && <Loader active={isLoading} />}
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/vocals" element={<Vocals />} />
          <Route path="/instruments" element={<Instruments />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/upcoming-event" element={<Events />} />
          <Route path="/video" element={<Videos />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enroll-now" element={<EnrollNow />} />
          <Route path="/payment/confirmation" element={<PaymentConfirmation />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/smtp-settings" element={<AdminSmtpSettings />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {/* {!isAdminRoute && <BackToTop />} */}
      {!isAdminRoute && <WhatsAppFloat />}
    </>
  )
}

export default App
