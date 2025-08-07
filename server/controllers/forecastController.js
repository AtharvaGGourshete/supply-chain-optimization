import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data'; // For Node.js environments

// Flask API URL
const FLASK_API_URL = 'http://127.0.0.1:5000/upload-and-forecast-all';

export const processForecast = async (req, res) => {
    // Check if a file was uploaded.
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Prepare the form data to be sent to the Flask API.
        const formData = new FormData();
        // Use fs.createReadStream to send the file.
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
        
        // Log the request to Flask for debugging.
        console.log(`Forwarding file to Flask API at ${FLASK_API_URL}`);

        // Forward the file to the Flask API using Axios.
        const flaskResponse = await axios.post(FLASK_API_URL, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Delete the temporary file after processing.
        fs.unlinkSync(req.file.path);

        // Send the JSON response from Flask back to the React client.
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error forwarding file to Flask:', error.response?.data || error.message);
        // Delete the temporary file if an error occurred.
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process forecast request.' });
    }
};

