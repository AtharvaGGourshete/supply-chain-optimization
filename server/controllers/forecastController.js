import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Flask API URLs
const FLASK_API_URL_PRODUCT = 'http://127.0.0.1:5000/forecast-and-optimize-product';
const FLASK_API_URL_AGGREGATE = 'http://127.0.0.1:5000/forecast-aggregate-data';

export const processProductForecast = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

        // Append additional optimization parameters from the request body
        for (const key in req.body) {
            formData.append(key, req.body[key]);
        }

        console.log(`Forwarding file to Flask API for single product at ${FLASK_API_URL_PRODUCT}`);

        const flaskResponse = await axios.post(FLASK_API_URL_PRODUCT, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        await unlinkAsync(req.file.path);
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error forwarding file to Flask:', error.response?.data || error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            await unlinkAsync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process forecast request.' });
    }
};

export const processAggregateForecast = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

        console.log(`Forwarding file to Flask API for aggregate data at ${FLASK_API_URL_AGGREGATE}`);

        const flaskResponse = await axios.post(FLASK_API_URL_AGGREGATE, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        await unlinkAsync(req.file.path);
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error forwarding file to Flask:', error.response?.data || error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            await unlinkAsync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process aggregate forecast request.' });
    }
};
