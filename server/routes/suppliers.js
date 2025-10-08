import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
import { promisify } from 'util';

const router = Router();
const unlinkAsync = promisify(fs.unlink);

// Multer config: Store uploads in /uploads, accept only CSV files
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Flask API endpoint to evaluate suppliers
const FLASK_API_URL = 'http://127.0.0.1:5000/evaluate-suppliers';

// POST /api/suppliers/evaluate
router.post('/evaluate', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    // Append weights JSON string if provided
    if (req.body.weights) {
      formData.append('weights', req.body.weights);
    } else {
      // Default weights can be sent here if desired
      formData.append('weights', JSON.stringify({
        cost: 0.3,
        reliability: 0.25,
        quality: 0.2,
        lead_time: 0.15,
        location: 0.1
      }));
    }

    console.log('Forwarding supplier data to Flask API...');

    const flaskResponse = await axios.post(FLASK_API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 30000, // 30 seconds timeout
    });

    // Delete the uploaded file after processing
    await unlinkAsync(req.file.path);

    res.status(200).json(flaskResponse.data);
  } catch (error) {
    console.error('Error in supplier evaluation:', error.response?.data || error.message);
    // Delete file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      await unlinkAsync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to process supplier evaluation', details: error.message });
  }
});

// GET /api/suppliers/template
router.get('/template', (req, res) => {
  const template = {
    filename: 'supplier_evaluation_template.csv',
    headers: [
      'supplier_id',
      'supplier_name', 
      'unit_price',
      'on_time_delivery_rate',
      'avg_lead_time',
      'quality_rating',
      'defect_rate',
      'distance_km',
      'financial_rating',
      'capacity'
    ],
    sample_data: [
      {
        supplier_id: 'SUPP001',
        supplier_name: 'ABC Manufacturing',
        unit_price: 25.50,
        on_time_delivery_rate: 94.5,
        avg_lead_time: 7,
        quality_rating: 4.2,
        defect_rate: 2.1,
        distance_km: 150,
        financial_rating: 'A',
        capacity: 10000
      },
      {
        supplier_id: 'SUPP002', 
        supplier_name: 'XYZ Suppliers',
        unit_price: 23.80,
        on_time_delivery_rate: 89.2,
        avg_lead_time: 10,
        quality_rating: 3.8,
        defect_rate: 3.5,
        distance_km: 220,
        financial_rating: 'B',
        capacity: 8000
      }
    ]
  };
  
  res.json(template);
});

export default router;
