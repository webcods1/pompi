import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Packages from './pages/Packages'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Bookings from './pages/Bookings'
import BusBooking from './pages/BusBooking'
import TrainBooking from './pages/TrainBooking'
import FlightBooking from './pages/FlightBooking'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/bus" element={<BusBooking />} />
        <Route path="/bookings/train" element={<TrainBooking />} />
        <Route path="/bookings/flight" element={<FlightBooking />} />
      </Routes>
    </Router>
  )
}

export default App
