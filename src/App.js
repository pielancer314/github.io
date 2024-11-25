import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import DeliveryManagement from './pages/driver/DeliveryManagement';
import usePiPlatform from './hooks/usePiPlatform';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = usePiPlatform();

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box as="main" py={8}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/driver/deliveries"
            element={
              <ProtectedRoute>
                <DeliveryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute>
                <DriverEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute>
                <DriverProfile />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/book-delivery"
            element={
              <ProtectedRoute>
                <BookDelivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-deliveries"
            element={
              <ProtectedRoute>
                <CustomerDeliveries />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
