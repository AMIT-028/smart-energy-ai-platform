 import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

    def prepare_data(df):
        # Time-based features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['month'] = df['timestamp'].dt.month
        
        # Categorical encoding for devices (0-25)
        df['device_id'] = df['device_id'].astype('category').cat.codes
        
        X = df[['device_id', 'hour', 'day_of_week', 'month']]
        y = df['consumption']
        return X, y

    def train_and_save():
        handler = MongoDataHandler()
        df = handler.get_all_logs()
        
        X, y = prepare_data(df)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        # Senior Engineer Tip: Use XGBoost for tabular data with missing time steps
        model = XGBRegressor(n_estimators=200, learning_rate=0.05, max_depth=6)
        model.fit(X_train, y_train)
        
        # Save the model and the device mapping
        joblib.dump(model, 'models/energy_model.pkl')
        print("Model Training Complete.")