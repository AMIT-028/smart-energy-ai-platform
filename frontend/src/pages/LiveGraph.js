import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required chart types
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function LiveGraph() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize socket and handle incoming data
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newLog", (log) => {
     const formattedTime = new Date(log.timestamp).toLocaleTimeString();
updateChart(formattedTime, log.consumption);

    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateChart = (time, value) => {
    if (!canvasRef.current) return;

    if (!chartRef.current) {
      // First chart render
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: [time],
          datasets: [
            {
              label: "Energy Consumption (kWh)",
              data: [value],
              borderColor: "rgba(37, 99, 235, 1)",      // Blue line
              backgroundColor: "rgba(37, 99, 235, 0.2)", // Gradient fill
              fill: true,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: "rgba(37, 99, 235, 1)",
              pointBorderColor: "#ffffff",
              tension: 0.4, // smooth curve
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: { size: 13 },
                color: "#1f2937",
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: "#1f2937",
              titleColor: "#fff",
              bodyColor: "#fff",
              padding: 10,
              borderColor: "#2563eb",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
                color: "#6b7280",
              },
              grid: {
                color: "rgba(0,0,0,0.05)",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#6b7280",
              },
              grid: {
                color: "rgba(0,0,0,0.07)",
              },
            },
          },
        },
      });
    } else {
      // Update existing chart
      const chart = chartRef.current;
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(value);

      // Limit stored points to avoid infinite graph expansion
      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update();
    }
  };

  // Destroy chart when component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Canvas only; size controlled via CSS (.right-graph canvas)
  return <canvas ref={canvasRef}></canvas>;
}
