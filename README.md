 ⚡ Smart Energy AI Platform

An end-to-end AI-powered Smart Energy Management System that simulates real-time energy consumption, performs machine learning-based forecasting, detects peak usage, sends automated alerts, and generates monthly electricity bills with per-device breakdown and PDF export.

🚀 Key Features

🔌 Real-time energy simulation and live monitoring using Socket.IO  
 📊 Interactive real-time, hourly, and weekly energy usage graphs using Chart.js  
 🕒 Time-series data ingestion and advanced analytics with MongoDB aggregation pipelines  
 🤖 Hourly energy consumption prediction and full-day forecasting using an ML microservice  
 ⚠️ Peak usage anomaly detection with automated email alerts and cooldown control  
 🧾 Complete monthly billing engine with:
  - Total consumption calculation (Wh → kWh conversion)  
  - Per-device energy usage and cost breakdown  
  - Monthly bill history tracking  
  - Downloadable PDF bill generation

    
🛠️ Tech Stack

 Backend
- Node.js, Express.js  
- MongoDB, Mongoose  
- Socket.IO  
- Nodemailer  
- PDFKit  

Machine Learning
- Python  
- XGBoost  
- Pandas, Scikit-learn  
- Flask ML microservice  

 Frontend
- React.js  
- Chart.js  
- Axios  


🧩 System Architecture

- Real-time simulator logs energy every 2 seconds  
- Logs stored in MongoDB  
- ML microservice predicts next-hour and daily usage  
- Backend aggregates data for analytics and billing  
- Frontend dashboard visualizes live usage, predictions, analytics, and bills  

 ⚙️ How to Run Locally

 1. Backend
-cd backend
-npm install
-npm start

2. ML Service
-cd ml-service
-pip install -r requirements.txt
-python app.py

3. Frontend
-cd frontend
-npm install
-npm start

📈 Future Enhancements:

-Budget limit alerts
-Auto monthly bill email
-Device-level forecasting
-Role-based admin dashboard
