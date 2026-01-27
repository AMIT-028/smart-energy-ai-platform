const ConsumptionLog = require("../models/ConsumptionLog");
const Device = require("../models/Device");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const RATE_PER_UNIT = 8;      
const WH_PER_UNIT = 1000;    

exports.getMonthlyBill = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await ConsumptionLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          timestamp: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: "$device",
          totalWh: { $sum: "$consumption" }
        }
      }
    ]);

    let totalWh = 0;

    const breakdown = await Promise.all(
      result.map(async (item) => {
        totalWh += item.totalWh;

        const units = item.totalWh / WH_PER_UNIT;
        const amount = units * RATE_PER_UNIT;

        const device = await Device.findById(item._id);

        return {
          deviceId: item._id,
          deviceName: device ? device.name : "Unknown Device",
          units: Number(units.toFixed(4)),
          amount: Number(amount.toFixed(2))
        };
      })
    );

    const totalUnits = totalWh / WH_PER_UNIT;
    const totalAmount = totalUnits * RATE_PER_UNIT;

    return res.status(200).json({
      year: Number(year),
      month: Number(month),
      totalWh: Number(totalWh.toFixed(4)),
      totalUnits: Number(totalUnits.toFixed(4)),
      ratePerUnit: RATE_PER_UNIT,
      amount: Number(totalAmount.toFixed(2)),
      breakdown     
    });

  } catch (error) {
    console.error("Monthly Bill Error:", error.message);
    res.status(500).json({ message: "Failed to generate monthly bill" });
  }
};

exports.getBillHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await ConsumptionLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          totalWh: { $sum: "$consumption" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const history = result.map(item => {
      const units = item.totalWh / WH_PER_UNIT;
      const amount = units * RATE_PER_UNIT;

      return {
        year: item._id.year,
        month: item._id.month,
        totalUnits: Number(units.toFixed(4)),
        amount: Number(amount.toFixed(2))
      };
    });

    res.json({ history });

  } catch (err) {
    console.error("Bill History Error:", err);
    res.status(500).json({ message: "Failed to fetch bill history" });
  }
};


exports.downloadBillPDF = async (req, res) => {
  try {
    const bill = req.body;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=monthly_bill.pdf");

    doc.pipe(res);

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Monthly Energy Bill", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Period: ${bill.month} / ${bill.year}`);
    doc.text(`Total Consumption: ${bill.totalWh} Wh`);
    doc.text(`Total Units: ${bill.totalUnits} kWh`);
    doc.text(`Rate: ₹${bill.ratePerUnit} / unit`);

    doc.moveDown(0.5);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total Amount: ₹${bill.amount}`);

    doc.moveDown(1);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Per-Device Breakdown");

    doc.moveDown(0.5);

    const colDevice = 40;
    const colUnits = 300;
    const colAmount = 420;

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Device", colDevice, doc.y);
    doc.text("Units (kWh)", colUnits, doc.y);
    doc.text("Amount (₹)", colAmount, doc.y);

    doc.moveDown(0.3);

    const lineY = doc.y;
    doc
      .moveTo(40, lineY)
      .lineTo(550, lineY)
      .stroke();

    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    bill.breakdown.forEach((d) => {
      const y = doc.y;

      doc.text(d.deviceName, colDevice, y, { width: 240 });
      doc.text(d.units.toString(), colUnits, y, { width: 80, align: "right" });
      doc.text(d.amount.toString(), colAmount, y, { width: 80, align: "right" });

      doc.moveDown(0.4);

      if (doc.y > 750) {
        doc.addPage();
      }
    });

    doc.end();

  } catch (err) {
    console.error("PDF Generation Error:", err.message);
    res.status(500).json({ message: "Failed to generate structured PDF" });
  }
};
