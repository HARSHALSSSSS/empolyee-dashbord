import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import DetailsPage from './pages/DetailsPage'
import CapturePhotoPage from './pages/CapturePhotoPage'
import PhotoResultPage from './pages/PhotoResultPage'
import { Toaster, toastConfig } from './components/ui/toast'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster {...toastConfig} />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/:id"
              element={
                <ProtectedRoute>
                  <DetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capture-photo"
              element={
                <ProtectedRoute>
                  <CapturePhotoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photo-result"
              element={
                <ProtectedRoute>
                  <PhotoResultPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
