import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Services from "./pages/Service";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfessionalDetails from "./pages/ProfessionalDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBooking";
import BookingDetails from "./pages/BookingDetails";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/professional/:professionalId"
            element={<ProfessionalDetails />}
          />
          <Route
            path="/booking/:professionalId/:serviceId"
            element={<Booking />}
          />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route
            path="/booking/:professionalId/:serviceId"
            element={<Booking />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/booking-details/:bookingId"
            element={<BookingDetails />}
          />
          <Route
            path="/professional-dashboard"
            element={<ProfessionalDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;