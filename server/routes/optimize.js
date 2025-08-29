// routes/optimize.js
import { Router } from 'express';
import mbxOptimization from '@mapbox/mapbox-sdk/services/optimization.js';

const router = Router();
const optimizationClient = mbxOptimization({ accessToken: process.env.MAPBOX_SECRET_TOKEN });

router.post('/optimize', async (req, res) => {
  try {
    const { coordinates, profile = 'driving' } = req.body;

    // Input validation
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ error: 'At least two coordinates (including depot) are required' });
    }
    if (coordinates.length > 12) {
      return res.status(400).json({ error: 'Mapbox Optimization API supports up to 12 coordinates' });
    }
    if (!['driving', 'driving-traffic'].includes(profile)) {
      return res.status(400).json({ error: 'Invalid profile. Use "driving" or "driving-traffic"' });
    }
    if (!coordinates.every(c => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite))) {
      return res.status(400).json({ error: 'Invalid coordinates. Expected [lng, lat]' });
    }

    const optReq = {
      waypoints: coordinates.map(c => ({ coordinates: c })), // Mapbox SDK wants { coordinates: [lng, lat] }
      profile,
      roundtrip: false,
      source: 'first',
      destination: 'last',
      geometries: 'geojson',
      steps: true,
      overview: 'full'
    };

    const resp = await optimizationClient.getOptimization(optReq).send();
    const body = resp.body;

    if (body.code !== 'Ok') {
      return res.status(400).json({ error: body.message || body.code || 'Optimization failed' });
    }

    const trip = Array.isArray(body.trips) && body.trips.length > 0 ? body.trips[0] : null;
    if (!trip?.geometry) {
      return res.status(500).json({ error: 'No trips returned from Mapbox' });
    }

    // Get optimized order (array of input indices)
    const order = trip.waypoint_order || [];
    const snapped = Array.isArray(body.waypoints) ? body.waypoints : [];

    const orderedWaypoints = (order.length ? order : [...Array(coordinates.length).keys()])
      .map(i => {
        const wp = snapped[i];
        return {
          location: wp?.location, // [lng, lat]
          name: wp?.name || `Stop ${i + 1}`
        };
      })
      .filter(wp => Array.isArray(wp.location));

    const routes = [{
      id: 'trip-1',
      geometry: trip.geometry,       // GeoJSON LineString
      distance: trip.distance,
      duration: trip.duration,
      waypoints: orderedWaypoints
    }];

    return res.json({ routes, status: 'optimized' });
  } catch (error) {
    const details = error?.response?.body?.message || error?.message;
    console.error('Optimization error:', details);
    return res.status(500).json({ error: 'Internal server error', details });
  }
});

export default router;
