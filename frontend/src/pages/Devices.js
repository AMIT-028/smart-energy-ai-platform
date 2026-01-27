import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Devices.css";

export default function Devices() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [power, setPower] = useState("");
  const [location, setLocation] = useState("");
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/devices/my-devices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(res.data.devices);
    } catch (err) {
      console.log("Error fetching devices");
    }
  };

  const addDevice = async () => {
    try {
      const token = localStorage.getItem("token");
      const cleanedPower = parseFloat(power.toString().replace(/[^0-9.]/g, "")); 
      await axios.post(
        "http://localhost:5000/api/devices/add",
        { name, power: Number(power), location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(""); setPower(""); setLocation("");
      fetchDevices();
    } catch (err) {
      console.log("Error adding device");
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/devices/update-status/${id}`,
        { status: status === "on" ? "off" : "on" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDevices();
    } catch (err) {
      console.log("Error toggling status");
    }
  };

  const deleteDevice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/devices/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDevices();
    } catch (err) {
      console.log("Error deleting device");
    }
  };

  return (
    <div className="devices-container">
      <h1 className="page-title">Device Manager</h1>
      <p className="subtitle">Monitor and control all your connected devices</p>

      {/* Add Device */}
      <div className="add-device-card">
        <h2>Add New Device</h2>
        <div className="input-grid">
          <input placeholder="Device Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input placeholder="Power (e.g., 120W)" value={power} onChange={(e) => setPower(e.target.value)} />
        </div>
        <button className="primary-btn" onClick={addDevice}>+ Add Device</button>
      </div>

      {/* Devices List */}
      <h2 className="section-title">Your Devices ({devices.length})</h2>
      <div className="devices-grid">
        {devices.map((device) => (
          <div key={device._id} className="device-card">
            <div className="device-header">
              <h3>{device.name}</h3>
              <span className={`status-tag ${device.status === "on" ? "online" : "offline"}`}>
                {device.status === "on" ? "Online" : "Offline"}
              </span>
            </div>

            <p>📍 {device.location}</p>
            <p>⚡ {device.power} W</p>

            <div className="device-actions">
              <button
                className="toggle-btn"
                onClick={() => toggleStatus(device._id, device.status)}
              >
                {device.status === "on" ? "Turn Off" : "Turn On"}
              </button>

              <button className="delete-btn" onClick={() => deleteDevice(device._id)}>
                🗑
              </button>
            </div>

            <div className="prediction-row">
              <button className="prediction-btn" onClick={() => navigate(`/predict/${device._id}`)}>
                🔮 Next Hour Prediction 
              </button>
              <button className="forecast-btn" onClick={() => navigate(`/forecast/${device._id}`)}>
                📅 24-Hour Energy Forecast
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
