import { Router } from 'express';
import multer from 'multer';
import { processProductForecast, processAggregateForecast } from '../controllers/forecastController.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Route for single-product forecasting and optimization
router.post('/forecast-and-optimize-product', upload.single('file'), processProductForecast);

// Route for aggregate business forecasting
router.post('/forecast-aggregate-data', upload.single('file'), processAggregateForecast);

export default router;