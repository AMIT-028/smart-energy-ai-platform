// Analytics.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import io from "socket.io-client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, 
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [hourData, setHourData] = useState([]);
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    fetchTodayUsage();
    fetchWeeklyUsage();
    const socket = io("http://localhost:5000");

  socket.on("newLog", () => {
    // whenever a new log arrives, refresh both graphs
    fetchTodayUsage();
    fetchWeeklyUsage();
  });

  return () => socket.disconnect();
  }, []);

  const fetchTodayUsage = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/consumption/today-hour-wise",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setHourData(res.data);
  };

  const fetchWeeklyUsage = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/consumption/weekly-day-wise",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setWeekData(res.data);
  };

  return {
    hourlyChart: (
      <Line
        data={{
          labels: hourData.map((item) => `${item._id}:00`),
          datasets: [
            {
              label: "kWh Consumption",
              data: hourData.map((item) => item.totalConsumption),
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, .3)",
              tension: 0.4,
            },
          ],
        }}
      />
    ),
    weeklyChart: (
  <Bar
    data={{
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      datasets: [
        {
          label: "kWh Consumption",
          data: Array.from({ length: 7 }, (_, i) => {
            const day = i + 1;
            const match = weekData.find((d) => d._id === day);
            return match ? match.totalConsumption : 0;
          }),
          backgroundColor: "#f59e0b",
        },
      ],
    }}
  />
)

  };
}
