// Forecast.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";

export default function Forecast() {
  const { deviceId } = useParams();
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `http://localhost:5000/api/ml/forecast/${deviceId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Forecast API response:", res.data);
        setForecast(res.data.forecast || []);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchForecast();
  }, [deviceId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Energy Forecast — Next 24 Hours</h2>

      {forecast.length > 0 ? (
        <Line
          data={{
            labels: Array.from({ length: forecast.length }, (_, i) => `Hour ${i}`),
            datasets: [{
              label: "Predicted Consumption (Wh)",
              data: forecast,
              borderColor: "green",
              backgroundColor: "lightgreen",
              tension: 0.3
            }]
          }}
        />
      ) : (
        <p>Loading forecast data...</p>
      )}
    </div>
  );
}
