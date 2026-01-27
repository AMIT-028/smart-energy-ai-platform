import { useEffect, useState } from "react";
import axios from "axios";

export default function BillHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/bill/history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistory(res.data.history);
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>📅 Bill History</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Month</th>
            <th>Units (kWh)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {history.map((b, idx) => (
            <tr key={idx}>
              <td>{b.month}/{b.year}</td>
              <td>{b.totalUnits}</td>
              <td>₹{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
