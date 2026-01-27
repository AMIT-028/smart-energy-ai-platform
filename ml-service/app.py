# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load model & encoder at startup
try:
    model = joblib.load("models/energy_model.pkl")
    le = joblib.load("models/device_encoder.pkl")
    print("✅ ML model & encoder loaded")
except Exception as e:
    print("❌ Failed to load model:", e)
    model = None
    le = None

@app.route("/predict", methods=["POST"])
def predict():
    if model is None or le is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    device_id = str(data.get("device_id"))
    timestamp = data.get("timestamp")

    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))

        print("Incoming device_id:", device_id)

        if device_id not in le.classes_:
            return jsonify({
                "prediction": None,
                "message": "Device not present in trained model"
            }), 200

        device_encoded = le.transform([device_id])[0]

        features = pd.DataFrame([{
            "device_encoded": device_encoded,
            "hour": dt.hour,
            "day_of_week": dt.weekday(),
            "month": dt.month
        }])

        pred = model.predict(features)[0]

        return jsonify({
            "prediction": float(pred)
        })

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/predict/today-forecast", methods=["POST"])
def today_forecast():
    if model is None or le is None:
        return jsonify({"forecast": []}), 500

    data = request.json
    device_id = str(data.get("device_id"))
    today = datetime.now()

    try:
        if device_id not in le.classes_:
            return jsonify({"forecast": []})

        device_encoded = le.transform([device_id])[0]
        results = []

        # 24-hour forecast (hourly points)
        for h in range(24):
            features = pd.DataFrame([{
                "device_encoded": device_encoded,
                "hour": h,
                "day_of_week": today.weekday(),
                "month": today.month
            }])
            pred = model.predict(features)[0]
            results.append(float(pred))

        return jsonify({"forecast": results})

    except Exception as e:
        print("Forecast error:", e)
        return jsonify({"forecast": []}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
