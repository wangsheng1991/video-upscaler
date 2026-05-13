import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import ModelDetail from './pages/ModelDetail'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import BlogIndex from './pages/BlogIndex'
import BlogDetail from './pages/BlogDetail'
import VRAMCalculator from './pages/VRAMCalculator'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/model/:id" element={<ModelDetail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/tools/vram-calculator" element={<VRAMCalculator />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
