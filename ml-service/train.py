import pandas as pd
import joblib
from pymongo import MongoClient
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder
import os

def train_model():
    # 1. Hardcoded connection for immediate success
    # Ensure this matches your actual database name in Atlas (test or SmartEnergyDB)
    URI = "mongodb+srv://amitguptaji028_db_user:dalEwkJqdIWImjzg@smart-energy.xkk7fwf.mongodb.net/?appName=smart-energy"
    client = MongoClient(URI)
    
    # IMPORTANT: Check your MongoDB Compass/Atlas. 
    # If your collection is under 'test', use client['test']
    db = client['SmartEnergyDB']

    collection = db['consumptionlogs']

    # Fetch logs
    cursor = collection.find()
    logs_list = list(cursor)
    df = pd.DataFrame(logs_list)

    if df.empty:
        print("❌ Still no data! Check: 1. Is your simulator.js running? 2. Is the DB name 'test' or 'SmartEnergyDB'?")
        return False

    # 2. Preprocessing
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    # Convert MongoDB ObjectIDs to strings for encoding
    df['device_id'] = df['device'].astype(str)
    
    le = LabelEncoder()
    df['device_encoded'] = le.fit_transform(df['device_id'])

    # 3. Features and Target
    X = df[['device_encoded', 'hour', 'day_of_week', 'month']]
    y = df['consumption']

    # 4. XGBoost Model
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X, y)

    # 5. Save Assets
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(model, 'models/energy_model.pkl')
    joblib.dump(le, 'models/device_encoder.pkl')
    
    print(f"✅ SUCCESS: Trained on {len(df)} logs!")
    return True

if __name__ == "__main__":
    train_model()