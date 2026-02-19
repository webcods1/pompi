import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Packages from './pages/Packages'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import PackageDetails from './pages/PackageDetails'
import Bookings from './pages/Bookings'
import BusBooking from './pages/BusBooking'
import TrainBooking from './pages/TrainBooking'
import FlightBooking from './pages/FlightBooking'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AllKeralaPackages from './pages/AllKeralaPackages'
import { AuthProvider } from './context/AuthContext'
import './index.css'

import LoginModal from './components/LoginModal';

function AppContent() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/bus" element={<BusBooking />} />
          <Route path="/bookings/train" element={<TrainBooking />} />
          <Route path="/bookings/flight" element={<FlightBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/kerala-packages" element={<AllKeralaPackages />} />
        </Routes>
      </Router>
      <LoginModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
