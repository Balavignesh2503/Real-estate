import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import LayoutEditor from './Layout/LayoutEditor';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './pages/Home';
import About from './pages/About';
import PropertyDetails from './pages/PropertyDetails';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerLayout from './Layout/OwnerLayout';
import UserLayout from './Layout/UserLayout';
import OwnerOverview from './pages/Owner/OwnerOverview';
import OwnerLayouts from './pages/Owner/OwnerLayouts';
import OwnerCreateLayout from './pages/Owner/OwnerCreateLayout';
import OwnerBookings from './pages/Owner/OwnerBookings';
import UserOverview from './pages/User/UserOverview';
import UserBookings from './pages/User/UserBookings';
import UserProfile from './pages/User/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="layout/:id" element={<LayoutEditor />} />
          {/* Add more routes as needed */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['REAL_ESTATE_OWNER', 'ADMIN']} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerOverview />} />
            <Route path="layouts" element={<OwnerLayouts />} />
            <Route path="layouts/new" element={<OwnerCreateLayout />} />
            <Route path="layout/:id/editor" element={<LayoutEditor />} />
            <Route path="bookings" element={<OwnerBookings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserOverview />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
