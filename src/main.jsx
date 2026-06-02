import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Pages
import Home from './pages/Home'
import Generator from './pages/Generator'


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
{ path: '/generator', element: <Generator /> },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)