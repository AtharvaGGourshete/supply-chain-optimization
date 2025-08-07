import { Router } from 'express';
import multer from 'multer';
import { processForecast } from '../controllers/forecastController.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/forecast', upload.single('file'), processForecast); // The upload.single('file') middleware handles the file upload
export default router;