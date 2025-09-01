import os
import logging
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from prophet import Prophet
from scipy.stats import norm
import numpy as np

# Setup Flask app
app = Flask(__name__)

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to pretrained Prophet models (PKL format)
MODEL_PATHS = {
    "sales": "models/sales_model.pkl",
    "quantity": "models/quantity_model.pkl",
    "deliveries": "models/deliveries_model.pkl"
}

# Load pretrained models into memory
PRETRAINED_MODELS = {}
for name, path in MODEL_PATHS.items():
    try:
        PRETRAINED_MODELS[name] = joblib.load(path)
        logger.info(f"Loaded pretrained model for {name}")
    except Exception as e:
        logger.error(f"Could not load model {name}: {e}")
        PRETRAINED_MODELS[name] = None


def clone_model(template_model: Prophet) -> Prophet:
    """Rebuild a fresh Prophet instance from a pretrained (pickled) one."""
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

    # Copy seasonalities
    for name, props in template_model.seasonalities.items():
        if name not in new_model.seasonalities:
            new_model.add_seasonality(
                name=name,
                period=props["period"],
                fourier_order=props["fourier_order"],
                prior_scale=props["prior_scale"]
            )

    # Copy holidays
    if template_model.holidays is not None:
        new_model.holidays = template_model.holidays.copy()

    return new_model


@app.route("/forecast-and-optimize-product", methods=["POST"])
def forecast_and_optimize_product():
    try:
        file = request.files["file"]
        metric_name = request.form.get("metric_name", "sales")
        service_level = float(request.form.get("service_level", 0.95))
        lead_time_days = int(request.form.get("lead_time_days", 7))
        current_inventory = int(request.form.get("current_inventory", 0))

        df = pd.read_csv(file)
        df["ds"] = pd.to_datetime(df["ds"])

        results = {}
        for metric in ["sales", "quantity", "deliveries"]:
            col = f"y_{metric}"
            if col not in df.columns:
                continue
            df_metric = df[["ds", col]].rename(columns={col: "y"})
            model = clone_model(PRETRAINED_MODELS.get(metric))
            model.fit(df_metric)
            future = model.make_future_dataframe(periods=30)
            forecast = model.predict(future)
            forecast_df = forecast.tail(30)[["ds", "yhat", "yhat_lower", "yhat_upper"]]
            forecast_df["ds"] = forecast_df["ds"].dt.strftime("%Y-%m-%d")
            results[metric] = {"forecast": forecast_df.to_dict(orient="records")}

        if metric_name not in results:
            return jsonify({
                "error": f"Metric '{metric_name}' not found or no data for it."
            }), 400

        forecast_optimized = results[metric_name]["forecast"]
        yhat_values = [f["yhat"] for f in forecast_optimized]
        avg_daily_demand = np.mean(yhat_values)
        ci_width = [f["yhat_upper"] - f["yhat_lower"] for f in forecast_optimized]
        std_dev_daily = np.mean(ci_width) / (2 * 1.96)  # Approximate std from 95% CI
        z = norm.ppf(service_level)
        std_dev_lead = std_dev_daily * np.sqrt(lead_time_days)
        safety_stock = z * std_dev_lead
        reorder_point = avg_daily_demand * lead_time_days + safety_stock
        forecasted_demand = avg_daily_demand * 30
        optimal_replenishment_quantity = max(0, forecasted_demand + safety_stock - current_inventory)

        results[metric_name].update({
            "forecasted_demand": forecasted_demand,
            "safety_stock": safety_stock,
            "reorder_point": reorder_point,
            "optimal_replenishment_quantity": optimal_replenishment_quantity,
            "metric": metric_name
        })

        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in forecast-and-optimize-product: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/forecast-aggregate-data", methods=["POST"])
def forecast_aggregate_data():
    try:
        file = request.files["file"]
        df = pd.read_csv(file)
        df["ds"] = pd.to_datetime(df["ds"])

        results = {}
        for metric in ["sales", "revenue"]:
            col = f"y_{metric}"
            if col not in df.columns:
                logger.warning(f"Skipping {metric}, not found in CSV.")
                continue

            df_metric = df[["ds", col]].rename(columns={col: "y"})

            model = Prophet()  # Default for revenue
            if metric == "sales":
                model = clone_model(PRETRAINED_MODELS.get("sales"))

            model.fit(df_metric)
            future = model.make_future_dataframe(periods=90)  # Enough for quarterly
            forecast = model.predict(future).tail(90)
            forecast["ds"] = pd.to_datetime(forecast["ds"])
            forecast.set_index("ds", inplace=True)

            if metric == "sales":
                monthly = forecast.resample("M")["yhat"].sum().reset_index()
                monthly["ds"] = monthly["ds"].dt.to_period("M").astype(str)
                results["monthly_sales"] = monthly.to_dict(orient="records")
            elif metric == "revenue":
                quarterly = forecast.resample("Q")["yhat"].sum().reset_index()
                quarterly["ds"] = quarterly["ds"].dt.to_period("Q").astype(str)
                results["quarterly_revenue"] = quarterly.to_dict(orient="records")

        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in forecast-aggregate-data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))