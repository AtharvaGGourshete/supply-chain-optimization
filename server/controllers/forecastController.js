import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { promisify } from 'util';
import User from '../models/users.js'; // Import the User model

const unlinkAsync = promisify(fs.unlink);

const FLASK_API_URL_PRODUCT = 'http://127.0.0.1:5000/forecast-and-optimize-product';
const FLASK_API_URL_AGGREGATE = 'http://127.0.0.1:5000/forecast-aggregate-data';

// Helper to save analysis data
const saveAnalysisToUser = async (userId, analysisType, data, fileInfo) => {
    const update = {};
    if (analysisType === 'single') {
        update['analysis.singleProductAnalysis'] = data;
        update['analysis.singleProductFile'] = fileInfo;
    } else {
        update['analysis.aggregateAnalysis'] = data;
        update['analysis.aggregateFile'] = fileInfo;
    }
    await User.findByIdAndUpdate(userId, { $set: update });
};

export const processProductForecast = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // Assume auth middleware adds user to req
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
        for (const key in req.body) {
            formData.append(key, req.body[key]);
        }

        const flaskResponse = await axios.post(FLASK_API_URL_PRODUCT, formData, {
            headers: { ...formData.getHeaders() }
        });
        
        // Save results to user's document in DB
        await saveAnalysisToUser(req.user.id, 'single', flaskResponse.data, {
            originalName: req.file.originalname,
            uploadDate: new Date()
        });

        await unlinkAsync(req.file.path);
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error in single product forecast:', error.response?.data || error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            await unlinkAsync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process forecast.' });
    }
};

export const processAggregateForecast = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

        const flaskResponse = await axios.post(FLASK_API_URL_AGGREGATE, formData, {
            headers: { ...formData.getHeaders() }
        });

        // Save results to user's document in DB
        await saveAnalysisToUser(req.user.id, 'aggregate', flaskResponse.data, {
            originalName: req.file.originalname,
            uploadDate: new Date()
        });

        await unlinkAsync(req.file.path);
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error in aggregate forecast:', error.response?.data || error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            await unlinkAsync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process aggregate forecast.' });
    }
};

// New controller to get stored analysis data
export const getAnalysisData = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    try {
        const user = await User.findById(req.user.id).select('analysis');
        if (!user || !user.analysis) {
            return res.status(404).json({ message: "No analysis data found." });
        }
        res.status(200).json(user.analysis);
    } catch (error) {
        console.error("Error fetching analysis data:", error.message);
        res.status(500).json({ error: "Failed to retrieve analysis data." });
    }
};
