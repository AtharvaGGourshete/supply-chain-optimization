import { useState } from 'react'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Catch-all for unmatched routes */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App
