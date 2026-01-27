import pandas as pd
import joblib
from pymongo import MongoClient
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder
import os
from dotenv import load_dotenv

load_dotenv()

def train_model():
    # Read from environment variables (SECURE)
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")

    if not MONGO_URI or not DB_NAME:
        raise ValueError("MONGO_URI or DB_NAME not set in environment")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db["consumptionlogs"]

    print("Fetching logs from MongoDB...")
    logs = list(collection.find())

    df = pd.DataFrame(logs)

    if df.empty:
        print("❌ No data found in MongoDB.")
        return

    print(f"✅ Loaded {len(df)} logs")

    # -------- Preprocessing --------
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["month"] = df["timestamp"].dt.month

    # Encode device ObjectId -> number
    df["device_id"] = df["device"].astype(str)

    le = LabelEncoder()
    df["device_encoded"] = le.fit_transform(df["device_id"])

    # Features & Target
    X = df[["device_encoded", "hour", "day_of_week", "month"]]
    y = df["consumption"]

    print("Training XGBoost model...")
    model = XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        n_jobs=-1,
        random_state=42
    )

    model.fit(X, y)

    # Save assets
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/energy_model.pkl")
    joblib.dump(le, "models/device_encoder.pkl")

    print("🎉 TRAINING COMPLETE")
    print(f"Devices trained: {len(le.classes_)}")

if __name__ == "__main__":
    train_model()
