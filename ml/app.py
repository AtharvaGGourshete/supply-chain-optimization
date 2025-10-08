import os
import logging
import math
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from prophet import Prophet
from scipy.stats import norm
from sklearn.preprocessing import MinMaxScaler
import json

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to pretrained Prophet models (PKL files)
MODEL_PATHS = {
    "sales": "models/sales_model.pkl",
    "quantity": "models/quantity_model.pkl",
    "deliveries": "models/deliveries_model.pkl"
}

# Load pretrained models into memory
PRETRAINED_MODELS = {}
for name, path in MODEL_PATHS.items():
    try:
        if os.path.exists(path):
            PRETRAINED_MODELS[name] = joblib.load(path)
            logger.info(f"Loaded pretrained model for {name}")
        else:
            logger.warning(f"Model file not found: {path}")
            PRETRAINED_MODELS[name] = None
    except Exception as e:
        logger.error(f"Could not load model {name}: {e}")
        PRETRAINED_MODELS[name] = None

def clone_model(template_model: Prophet) -> Prophet:
    """
    Rebuild a fresh Prophet instance from a pretrained (pickled) model.
    Copies configuration, seasonalities, and holidays.
    """
    if template_model is None:
        return Prophet()

    config = {
        "growth": template_model.growth,
        "changepoints": None,
        "n_changepoints": template_model.n_changepoints,
        "changepoint_range": template_model.changepoint_range,
        "yearly_seasonality": template_model.yearly_seasonality,
        "weekly_seasonality": template_model.weekly_seasonality,
        "daily_seasonality": template_model.daily_seasonality,
        "seasonality_mode": template_model.seasonality_mode,
        "seasonality_prior_scale": template_model.seasonality_prior_scale,
        "holidays_prior_scale": template_model.holidays_prior_scale,
        "changepoint_prior_scale": template_model.changepoint_prior_scale,
    }

    new_model = Prophet(**config)

    for name, props in template_model.seasonalities.items():
        if name not in new_model.seasonalities:
            new_model.add_seasonality(
                name=name,
                period=props["period"],
                fourier_order=props["fourier_order"],
                prior_scale=props["prior_scale"]
            )

    if template_model.holidays is not None:
        new_model.holidays = template_model.holidays.copy()

    return new_model

def calculate_eoq(annual_demand: float, ordering_cost: float, holding_cost: float) -> float:
    """
    Calculate Economic Order Quantity (EOQ).
    EOQ = sqrt(2 * D * S / H)
    where D = annual demand, S = ordering cost, H = holding cost per unit.
    """
    if annual_demand <= 0 or holding_cost <= 0:
        return 0.0
    return math.sqrt((2 * annual_demand * ordering_cost) / holding_cost)

def abc_analysis(products: list) -> list:
    """
    Perform ABC classification on a list of products.
    Each product dict must include 'annual_demand' and 'unit_cost'.
    Returns list with 'abc_category' and 'annual_value' added.
    """
    for p in products:
        p['annual_value'] = p['annual_demand'] * p['unit_cost']

    products.sort(key=lambda x: x['annual_value'], reverse=True)
    total_value = sum(p['annual_value'] for p in products)

    cum = 0.0
    for p in products:
        cum += p['annual_value']
        ratio = cum / total_value if total_value > 0 else 0
        if ratio <= 0.8:
            p['abc_category'] = 'A'
        elif ratio <= 0.95:
            p['abc_category'] = 'B'
        else:
            p['abc_category'] = 'C'

    return products

@app.route("/forecast-and-optimize-product", methods=["POST"])
def forecast_and_optimize_product():
    """
    Endpoint for single-product demand forecasting and inventory optimization.
    Expects:
      - CSV file with columns: ds (date), y_sales, y_quantity, y_deliveries
      - Form data: service_level, lead_time_days, current_inventory,
                   ordering_cost, holding_cost, unit_cost
    Returns JSON with:
      - 30-day forecast for sales, quantity, and deliveries
      - KPIs: forecasted demand (1 month), safety stock, reorder point,
              optimal replenishment qty, EOQ, ABC category, etc.
    """
    try:
        file = request.files["file"]
        SL = float(request.form.get("service_level", 0.95))
        LT = int(request.form.get("lead_time_days", 7))
        CI = int(request.form.get("current_inventory", 0))
        OC = float(request.form.get("ordering_cost", 100))
        HC = float(request.form.get("holding_cost", 10))
        UC = float(request.form.get("unit_cost", 50))

        # Read input CSV
        df = pd.read_csv(file)
        required_cols = ["ds", "y_sales", "y_quantity", "y_deliveries"]
        if not all(col in df.columns for col in required_cols):
            return jsonify({"error": f"CSV must contain columns: {', '.join(required_cols)}"}), 400
        df["ds"] = pd.to_datetime(df["ds"])

        # Initialize results
        results = {}

        # Process each metric: sales, quantity, deliveries
        for metric in ["sales", "quantity", "deliveries"]:
            df_m = df[["ds", f"y_{metric}"]].rename(columns={f"y_{metric}": "y"})

            # Clone and fit model
            model = clone_model(PRETRAINED_MODELS.get(metric))
            model.fit(df_m)

            # Generate 30-day forecast
            future = model.make_future_dataframe(periods=30)
            forecast = model.predict(future)
            last30 = forecast.tail(30)[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
            last30["ds"] = last30["ds"].dt.strftime("%Y-%m-%d")

            # Compute average daily demand and 1-month forecast
            y = last30["yhat"].values
            avg_daily = np.mean(y)
            demand_1m = avg_daily * 30

            # Compute safety stock
            ci = (last30["yhat_upper"] - last30["yhat_lower"]).values
            std_daily = np.mean(ci) / (2 * 1.96) if len(ci) > 0 else 0
            z = norm.ppf(SL)
            std_lead = std_daily * math.sqrt(LT) if std_daily > 0 else 0
            safety_stock = z * std_lead

            # Reorder point and optimal replenishment quantity (only for sales)
            reorder_point = avg_daily * LT + safety_stock if metric == "sales" else None
            optimal_qty = max(0, demand_1m + safety_stock - CI) if metric == "sales" else None

            # EOQ calculation using annualized demand (only for sales)
            annual_demand = avg_daily * 365
            eoq = calculate_eoq(annual_demand, OC, HC) if metric == "sales" else None

            # ABC classification (only for sales)
            abc = abc_analysis([{
                "id": "current_product",
                "annual_demand": annual_demand,
                "unit_cost": UC,
                "ordering_cost": OC,
                "holding_cost": HC
            }])[0] if metric == "sales" else None

            # Assemble results for this metric
            results[metric] = {
                "forecast": last30.to_dict(orient="records"),
                "forecast_period_days": 30,
                "forecast_period_months": 1,
                "forecasted_demand": round(demand_1m, 2),
            }
            if metric == "sales":
                results[metric].update({
                    "safety_stock": round(safety_stock, 2),
                    "reorder_point": round(reorder_point, 2),
                    "optimal_replenishment_quantity": round(optimal_qty, 2),
                    "eoq": round(eoq, 2),
                    "abc_category": abc["abc_category"],
                    "annual_value": round(abc["annual_value"], 2),
                    "optimization_basis": "Optimized based on sales data",
                    "recommendation": "Sales data is used for inventory optimization"
                })

        return jsonify(results)

    except Exception as e:
        logger.error(f"Error in single forecast: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/forecast-aggregate-data", methods=["POST"])
def forecast_aggregate_data():
    """
    Endpoint for aggregate business forecasting.
    Expects:
      - CSV file with columns: ds (date), y_sales, y_revenue
    Returns JSON with:
      - Monthly sales forecast (12 months)
      - Quarterly revenue forecast (4 quarters)
      - Annual summary values
    """
    try:
        file = request.files["file"]
        df = pd.read_csv(file)
        required_cols = ["ds", "y_sales", "y_revenue"]
        if not all(col in df.columns for col in required_cols):
            return jsonify({"error": f"CSV must contain columns: {', '.join(required_cols)}"}), 400
        df["ds"] = pd.to_datetime(df["ds"])
        results = {}

        for metric in ["sales", "revenue"]:
            col = f"y_{metric}"
            df_m = df[["ds", col]].rename(columns={col: "y"})
            model = Prophet() if metric == "revenue" else clone_model(PRETRAINED_MODELS.get("sales"))
            model.fit(df_m)

            # 12-month forecast
            future = model.make_future_dataframe(periods=365)
            forecast = model.predict(future).tail(365)
            forecast["ds"] = pd.to_datetime(forecast["ds"])
            forecast.set_index("ds", inplace=True)

            # Monthly aggregation
            monthly = forecast.resample("M")["yhat"].sum().reset_index()
            monthly["ds"] = monthly["ds"].dt.strftime("%Y-%m")  # Backend still uses YYYY-MM
            monthly["yhat"] = monthly["yhat"].round(2)

            # Quarterly aggregation
            quarterly = forecast.resample("Q")["yhat"].sum().reset_index()
            quarterly["ds"] = quarterly["ds"].dt.to_period("Q").astype(str)
            quarterly["yhat"] = quarterly["yhat"].round(2)

            results[f"monthly_{metric}"] = monthly.to_dict(orient="records")
            results[f"quarterly_{metric}"] = quarterly.to_dict(orient="records")
            results[f"annual_{metric}_forecast"] = round(forecast["yhat"].sum(), 2)

        return jsonify(results)

    except Exception as e:
        logger.error(f"Error in aggregate forecast: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/evaluate-suppliers", methods=["POST"])
def evaluate_suppliers():
    """
    Evaluate and rank suppliers based on multiple criteria using weighted scoring.
    Expects CSV file with supplier data and weights as form data.
    """
    try:
        file = request.files["file"]
        weights_json = request.form.get("weights", "{}")
        weights = json.loads(weights_json)
        
        # Read supplier CSV data
        df = pd.read_csv(file)
        
        # Validate required columns
        required_cols = ['supplier_id', 'supplier_name', 'unit_price', 'on_time_delivery_rate', 
                        'avg_lead_time', 'quality_rating', 'defect_rate', 'distance_km']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns: {missing_cols}"}), 400
        
        # Default weights if not provided
        default_weights = {
            'cost': 0.3,
            'reliability': 0.25, 
            'quality': 0.2,
            'lead_time': 0.15,
            'location': 0.1
        }
        weights = {**default_weights, **weights}
        
        # Normalize weights to sum to 1
        total_weight = sum(weights.values())
        weights = {k: v/total_weight for k, v in weights.items()}
        
        # Calculate scores for each supplier
        suppliers_scored = []
        
        # Get max/min values for normalization
        max_price = df['unit_price'].max()
        min_price = df['unit_price'].min()
        max_lead_time = df['avg_lead_time'].max()
        min_lead_time = df['avg_lead_time'].min()
        max_distance = df['distance_km'].max()
        min_distance = df['distance_km'].min()
        max_defect = df['defect_rate'].max()
        min_defect = df['defect_rate'].min()
        
        for _, supplier in df.iterrows():
            # Calculate individual scores (0-100 scale, higher is better)
            
            # Cost Score: Lower price = higher score
            if max_price != min_price:
                cost_score = 100 - ((supplier['unit_price'] - min_price) / (max_price - min_price) * 100)
            else:
                cost_score = 100
            
            # Reliability Score: Already in percentage
            reliability_score = supplier['on_time_delivery_rate']
            
            # Quality Score: Higher rating = higher score, Lower defects = higher score
            quality_from_rating = (supplier['quality_rating'] / 5.0) * 50  # Assuming 5-point scale
            if max_defect != min_defect:
                quality_from_defects = 50 - ((supplier['defect_rate'] - min_defect) / (max_defect - min_defect) * 50)
            else:
                quality_from_defects = 50
            quality_score = quality_from_rating + quality_from_defects
            
            # Lead Time Score: Lower lead time = higher score
            if max_lead_time != min_lead_time:
                lead_time_score = 100 - ((supplier['avg_lead_time'] - min_lead_time) / (max_lead_time - min_lead_time) * 100)
            else:
                lead_time_score = 100
            
            # Location Score: Closer distance = higher score
            if max_distance != min_distance:
                location_score = 100 - ((supplier['distance_km'] - min_distance) / (max_distance - min_distance) * 100)
            else:
                location_score = 100
            
            # Calculate weighted total score
            total_score = (
                cost_score * weights['cost'] +
                reliability_score * weights['reliability'] +
                quality_score * weights['quality'] +
                lead_time_score * weights['lead_time'] +
                location_score * weights['location']
            )
            
            # Determine recommendation
            if total_score >= 80:
                recommendation = "Highly Recommended"
                recommendation_color = "green"
            elif total_score >= 65:
                recommendation = "Recommended" 
                recommendation_color = "yellow"
            elif total_score >= 50:
                recommendation = "Consider"
                recommendation_color = "orange"
            else:
                recommendation = "Not Recommended"
                recommendation_color = "red"
            
            suppliers_scored.append({
                'supplier_id': supplier['supplier_id'],
                'supplier_name': supplier['supplier_name'],
                'total_score': round(total_score, 2),
                'cost_score': round(cost_score, 2),
                'reliability_score': round(reliability_score, 2),
                'quality_score': round(quality_score, 2),
                'lead_time_score': round(lead_time_score, 2),
                'location_score': round(location_score, 2),
                'recommendation': recommendation,
                'recommendation_color': recommendation_color,
                'unit_price': supplier['unit_price'],
                'on_time_delivery_rate': supplier['on_time_delivery_rate'],
                'avg_lead_time': supplier['avg_lead_time'],
                'quality_rating': supplier['quality_rating'],
                'distance_km': supplier['distance_km']
            })
        
        # Sort by total score (highest first)
        suppliers_scored.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Add ranking
        for i, supplier in enumerate(suppliers_scored):
            supplier['rank'] = i + 1
        
        return jsonify({
            'suppliers': suppliers_scored,
            'weights_used': weights,
            'total_suppliers': len(suppliers_scored)
        })
        
    except Exception as e:
        logger.error(f"Error in supplier evaluation: {e}")
        return jsonify({"error": str(e)}), 500


# Optional: Save supplier evaluation results
@app.route("/save-supplier-evaluation", methods=["POST"])
def save_supplier_evaluation():
    """Save supplier evaluation results for future reference"""
    try:
        evaluation_data = request.json
        # Here you would save to your database
        # For now, just return success
        return jsonify({"message": "Evaluation saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))