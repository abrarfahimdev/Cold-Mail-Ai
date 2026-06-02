import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
// Pages
import Home from './pages/Home'
import Generator from './pages/Generator'
import Inbox from './pages/Inbox'
import Analytics from './pages/Analytics'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
{ path: '/generator', element: <Generator /> },
 { path: '/inbox', element: <Inbox/> },
 { path: '/analytics', element: <Analytics/> },
 { path: '/history', element: <History/> },{ path: '/login', element: < Login/> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard/> },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)