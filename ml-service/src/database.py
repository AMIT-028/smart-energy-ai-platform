import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class MongoDataHandler:
    def __init__(self):
        self.client = MongoClient(os.getenv("mongodb+srv://amitguptaji028_db_user:dalEwkJqdIWImjzg@smart-energy.xkk7fwf.mongodb.net/?appName=smart-energy"))
        self.db = self.client[os.getenv("test")]
        self.collection = self.db['consumptionlogs']

    def get_all_logs(self):
        # Fetch data: device_id, consumption, timestamp
        cursor = self.collection.find({}, {'_id': 0})
        df = pd.DataFrame(list(cursor))
        if df.empty:
            return None
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df