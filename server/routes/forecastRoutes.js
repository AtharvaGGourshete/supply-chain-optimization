// path: server/routes/forecastRoutes.js

import { Router } from 'express';
import multer from 'multer';
import { processProductForecast, processAggregateForecast, getAnalysisData } from '../controllers/forecastController.js';
// --- THE FIX ---
// Import the one, unified authentication middleware
import isAuthenticated from '../middlewares/isAuthenticated.js'; 

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Apply the unified middleware to all protected routes
router.post('/forecast-and-optimize-product', isAuthenticated, upload.single('file'), processProductForecast);
router.post('/forecast-aggregate-data', isAuthenticated, upload.single('file'), processAggregateForecast);
router.get('/analysis-results', isAuthenticated, getAnalysisData);

export default router;
