import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import LiveGraph from "./LiveGraph";
import Analytics from "./Analytics";
import Devices from "./Devices";

import {
  LayoutDashboard,
  Zap,
  Smartphone,
  FileText,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const DashboardContent = () => {
  const [stats, setStats] = useState({
    currentLoad: 0,
    dailyCost: 0,
    activeDevices: 0,
    efficiency: "0%",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const navigate = useNavigate();   

  const analyticsData = Analytics();

  const handleNavigation = (path) => {
    if (path === "devices") {
      setActivePage("devices_" + Date.now()); 
      return;
    }

    if (path === "dashboard") {
      setActivePage("dashboard");
      setTimeout(() => {
        document.querySelector(".scroll-area")?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
      return;
    }

    setActivePage("dashboard");
    setTimeout(() => {
      if (path === "live") {
        document
          .getElementById("live-graph-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }
      if (path === "analytics") {
        document
          .getElementById("analytics-graph-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const goToMonthlyBill = () => {
    navigate("/bill");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/stats/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data);
      } catch (err) {
        console.log("Error fetching stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="logo-area">
          <Zap className="text-blue-400 fill-current" size={24} />
          {isSidebarOpen && <span className="brand-text">EnergyMinds</span>}
        </div>

        <nav className="nav-menu">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isOpen={isSidebarOpen}
            onClick={() => handleNavigation("dashboard")}
            active={activePage === "dashboard"}
          />

          <NavItem
            icon={<Zap size={20} />}
            label="Live Energy Usage"
            isOpen={isSidebarOpen}
            onClick={() => handleNavigation("live")}
          />

          <NavItem
            icon={<TrendingUp size={20} />}
            label="Analytics"
            isOpen={isSidebarOpen}
            onClick={() => handleNavigation("analytics")}
          />

          <NavItem
            icon={<Smartphone size={20} />}
            label="My Devices"
            isOpen={isSidebarOpen}
            onClick={() => handleNavigation("devices")}
            active={activePage.includes("devices")}
          />

          <NavItem
            icon={<FileText size={20} />}
            label="Monthly Bill"
            isOpen={isSidebarOpen}
            onClick={goToMonthlyBill}
          />
        </nav>

        <div className="bottom-actions">
          <button
            className={`nav-btn ${!isSidebarOpen ? "centered" : ""} hover:text-red-400`}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="nav-label">Log Out</span>}
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="icon-btn lg:hidden"
            >
              <Menu size={24} />
            </button>

            <h2 className="header-title">
              {activePage.includes("devices") ? "My Devices" : "Dashboard Overview"}
            </h2>
          </div>

          <div className="user-actions">
            <div className="search-bar">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>

            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="avatar">
              <i className="user fa-solid fa-user"></i>
            </div>
          </div>
        </header>

        <main className="scroll-area">
          <div className="content-wrapper">
            {activePage === "dashboard" && (
              <>
              
                <div className="stats-grid">
                  <StatCard
                    title="Current Load"
                    value={`${stats.currentLoad} kW`}
                    icon={<Zap size={24} color="#eab308" />}
                  />
                  <StatCard
                    title="Daily Cost"
                    value={`₹${stats.dailyCost}`}
                    icon={<FileText size={24} color="#10b981" />}
                  />
                  <StatCard
                    title="Active Devices"
                    value={stats.activeDevices}
                    icon={<Smartphone size={24} color="#3b82f6" />}
                  />
                  <StatCard
                    title="Efficiency"
                    value={stats.efficiency}
                    icon={<TrendingUp size={24} color="#a855f7" />}
                  />
                </div>

                <div id="live-graph-section" className="card">
                  <h3 className="chart-title">Real-Time Energy Consumption</h3>
                  <div className="chart-placeholder-container live-graph-layout">
                    <LiveGraph />
                  </div>
                </div>

         
                <div id="analytics-graph-section" className="split-grid">
                  <div className="card">
                    <h3 className="chart-title">Hourly Usage (Today)</h3>
                    <div style={{ height: "260px" }}>
                      {analyticsData.hourlyChart}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="chart-title">Weekly Usage (Day-wise)</h3>
                    <div style={{ height: "260px" }}>
                      {analyticsData.weeklyChart}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activePage.includes("devices") && <Devices key={activePage} />}
          </div>
        </main>
      </div>
    </div>
  );
};


const NavItem = ({ icon, label, isOpen, onClick, active }) => (
  <button
    onClick={onClick}
    className={`nav-btn ${active ? "active" : ""} ${!isOpen ? "centered" : ""}`}
  >
    {icon}
    {isOpen && (
      <span className="nav-label">
        {label}
        {active && <ChevronRight size={14} />}
      </span>
    )}
  </button>
);

const StatCard = ({ title, value, icon }) => (
  <div className="card">
    <div className="stat-header">
      <div className="stat-icon">{icon}</div>
    </div>
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

const Dashboard = () => <DashboardContent />;

export default Dashboard;
