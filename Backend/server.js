// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const app = express();
const deviceRoutes = require('./routes/deviceRoutes');
const consumptionRoutes = require("./routes/consumptionRoutes");
const mlRoutes = require("./routes/mlRoutes");
const billRoutes = require("./routes/billRoutes");
const statsRoutes = require("./routes/statsRoutes");
// connect to DB
connectDB();
// middlewares
app.use(cors());
app.use(express.json());
app.use("/api",authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/consumption", consumptionRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/stats", statsRoutes);




// basic route
app.get('/', (req, res) => {
  console.log("hi");
  res.send('Smart Energy Backend — API is running');
});


const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: { origin: "*" }
});
global.io = io;   // make socket available everywhere
require("./utils/simulator");