def engineer_features(df):
    # Time features (Crucial for non-consecutive data)
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    
    # Peak Hours (e.g., 6 PM - 10 PM)
    df['is_peak_hour'] = df['hour'].apply(lambda x: 1 if 18 <= x <= 22 else 0)
    
    # Label Encoding for Device IDs if they are strings
    df['device_id'] = df['device_id'].astype('category').cat.codes
    
    return df