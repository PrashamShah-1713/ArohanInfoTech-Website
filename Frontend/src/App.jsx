import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Technologies from './Pages/Technologies'
import Companydetails from './Pages/Companydetails'
import ServicesProvided from './Pages/servicesprovided'
import Portfolio from './Pages/Portfolio'
import Internships from './Pages/Interships'
import Login from './Pages/Login'
import ForgotPassword from './Pages/ForgotPassword'
import CreateAccount from './Pages/createAccount'
import Admin from './Pages/Admin'
import ProtectedRoute from './Components/ProtectedRoute.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/company' element={<Companydetails />} />
      <Route path='/services' element={<ServicesProvided />} />
      <Route path='/technologies' element={<Technologies />} />
      <Route path='/portfolio' element={<Portfolio />} />
      <Route path='/internships' element={<Internships />} />
      <Route path='/admin' element={<ProtectedRoute requiredRole='admin'><Admin /></ProtectedRoute>} />
      <Route path='/login' element={<Login />} /> 
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/create-account' element={<CreateAccount />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App