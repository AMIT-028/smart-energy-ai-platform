import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Style.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Devices from "./pages/Devices";
import LiveGraph from "./pages/LiveGraph";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Forecast from "./pages/Forecast";
import MonthlyBill from "./pages/MonthlyBill";
import Navbar from "./landingpage/Navbar";
import HeroSection from "./landingpage/HeroSection";
import FeaturesSection from "./landingpage/FeaturesSection";
import AboutUsSection from "./landingpage/AboutUsSection";
import Footer from "./landingpage/Footer";
import BillHistory from "./pages/BillHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeroSection />
              <FeaturesSection />
              <AboutUsSection />
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-usage"
          element={
            <ProtectedRoute>
              <LiveGraph />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict/:deviceId"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forecast/:deviceId"
          element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bill"
          element={
            <ProtectedRoute>
              <MonthlyBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bill/history"
          element={
            <ProtectedRoute>
              <BillHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
