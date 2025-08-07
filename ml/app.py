from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import logging
import traceback
import io

# Setup logging
logging.basicConfig(level=logging.INFO)

# Initialize the Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Define the paths for the pre-trained models
MODELS = {
    "sales": 'sales_model.pkl',
    "quantity": 'quantity_model.pkl',
    "deliveries": 'deliveries_model.pkl'
}

# Dictionary to hold the loaded models
loaded_models = {}

# Load all pre-trained models when the app starts.
for name, file_path in MODELS.items():
    try:
        logging.info(f"Loading pre-trained model for {name} from {file_path}...")
        loaded_models[name] = joblib.load(file_path)
        logging.info(f"Model for {name} loaded successfully.")
    except FileNotFoundError:
        logging.error(f"Model file '{file_path}' not found. Skipping.")
        loaded_models[name] = None
    except Exception as e:
        logging.error(f"Error loading model for {name}: {e}")
        loaded_models[name] = None

@app.route('/upload-and-forecast-all', methods=['POST'])
def upload_and_forecast_all():
    """
    API endpoint to accept a file upload and make forecasts for sales,
    order quantity, and deliveries.
    """
    # Check if all models were loaded successfully
    if not all(loaded_models.values()):
        return jsonify({"error": "One or more pre-trained models are not available."}), 503

    try:
        # Check for file upload
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        file_stream = io.BytesIO(file.read())

        # Read the file based on its extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_stream)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file_stream)
        else:
            return jsonify({"error": "Unsupported file type. Please upload a CSV or Excel file."}), 400
        
        # Data validation to ensure the required columns are present
        required_cols = ['ds', 'y_sales', 'y_quantity', 'y_deliveries']
        if not all(col in df.columns for col in required_cols):
            return jsonify({"error": f"Input data must contain all required columns: {', '.join(required_cols)}"}), 400

        # Convert 'ds' column to datetime
        df['ds'] = pd.to_datetime(df['ds'])

        # Create a combined results dictionary
        all_forecasts = {}

        # Loop through each model and make a prediction
        for metric, model in loaded_models.items():
            if model:
                # Prepare the future dataframe for prediction
                future = model.make_future_dataframe(periods=30, include_history=False)

                # Make the forecast
                forecast = model.predict(future)

                # Extract and format the forecast results
                forecast_results = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict('records')
                
                # Convert datestamps to strings for JSON serialization
                for item in forecast_results:
                    item['ds'] = item['ds'].strftime('%Y-%m-%d')

                all_forecasts[metric] = forecast_results
            
        logging.info("All forecasts generated successfully.")
        return jsonify(all_forecasts), 200

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
