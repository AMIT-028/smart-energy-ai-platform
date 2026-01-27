// PredictionPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import io from "socket.io-client";
import { AlertTriangle, Zap } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function PredictionPage() {
  const { deviceId } = useParams();
  const [past, setPast] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isPeak, setIsPeak] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();

  const predictNow = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/ml/predict/${deviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Prediction API response:", res.data);

      if (res.data.prediction !== null && res.data.input?.length > 0) {
        setPast(res.data.input);
        setPrediction(res.data.prediction);

        const avg = res.data.input.reduce((a, b) => a + b, 0) / res.data.input.length;
        setIsPeak(res.data.prediction > avg * 1.2);
      } else {
        console.log("Backend message:", res.data.message || res.data.mlMessage);
        setPast([]);
        setPrediction(null);
      }

    } catch (err) {
      console.error("Prediction Page Error:", err);
      setPast([]);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    predictNow();
    socketRef.current = io("http://localhost:5000");
    return () => socketRef.current.disconnect();
  }, [deviceId]);

  return (
    <div className="prediction-container">
      <div className="prediction-card">
        <h2>🔮 AI Energy Intelligence</h2>

        {isPeak && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px" }}>
            <AlertTriangle size={20} /> High Usage Prediction detected!
          </div>
        )}

        {loading ? (
          <p>Analyzing Data...</p>
        ) : past.length > 0 && prediction !== null ? (
          <>
            <div style={{ height: "300px" }}>
              <Line
                data={{
                  labels: ["T-4", "T-3", "T-2", "T-1", "Now", "Predicted"],
                  datasets: [{
                    label: "Wh",
                    data: [...past, prediction],
                    borderColor: isPeak ? "#ef4444" : "#8a2be2",
                    backgroundColor: "rgba(138, 43, 226, 0.1)",
                    fill: true,
                    tension: 0.4
                  }]
                }}
              />
            </div>

            <h3>Next Hour Forecast</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {prediction.toFixed(6)} Wh
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Zap size={48} color="#d1d5db" />
            <p>No usable prediction for this device yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
