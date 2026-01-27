import { useState } from "react";
import axios from "axios";
import "./MonthlyBill.css";

export default function MonthlyBill() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/bill/monthly/${year}/${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBill(res.data);
    } catch (err) {
      console.error("Bill fetch error:", err);
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Download PDF
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/bill/download",
        bill,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly_bill.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  return (
    <div className="bill-container">
      <div className="bill-card">
        <h2 className="bill-title">🧾 Monthly Energy Bill</h2>

        <div className="bill-form">
          <label>Year</label>
          <input
            type="number"
            className="bill-input"
            value={year}
            onChange={e => setYear(e.target.value)}
          />

          <label>Month</label>
          <input
            type="number"
            className="bill-input"
            min="1"
            max="12"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />

          <button className="bill-button" onClick={fetchBill}>
            Generate Bill
          </button>
        </div>

        {loading && <p className="loading-text">Generating bill...</p>}

        {bill && (
          <>
            {/* -------- Summary -------- */}
            <div className="bill-summary">
              <h3>Bill Summary</h3>

              <div className="bill-row">
                <span>Period</span>
                <span>{bill.month}/{bill.year}</span>
              </div>

              <div className="bill-row">
                <span>Total Consumption</span>
                <span>{bill.totalWh} Wh</span>
              </div>

              <div className="bill-row">
                <span>Total Units</span>
                <span>{bill.totalUnits} kWh</span>
              </div>

              <div className="bill-row">
                <span>Rate</span>
                <span>₹{bill.ratePerUnit} / unit</span>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-total">
                <span>Total Amount</span>
                <span className="bill-total-amount">₹{bill.amount}</span>
              </div>
            </div>

            {/* -------- Per-Device Breakdown -------- */}
            {bill.breakdown && bill.breakdown.length > 0 && (
              <div className="bill-summary" style={{ marginTop: "20px" }}>
                <h3>Per-Device Breakdown</h3>

                <table width="100%" border="1" cellPadding="8">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Units (kWh)</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.breakdown.map((d, idx) => (
                      <tr key={idx}>
                        <td>{d.deviceName}</td>
                        <td>{d.units}</td>
                        <td>₹{d.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* -------- Download Button -------- */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button className="bill-button" onClick={downloadPDF}>
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
