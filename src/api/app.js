const express = require('express');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

const azureMapsKey = process.env.AZURE_MAPS_KEY;
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/geocode', async (req, res) => {
  const queryText = req.query.q;
  try {
    const response = await axios.get('https://atlas.microsoft.com/geocode', {
      params: {
        'api-version': '2025-01-01',
        query: queryText,
        'subscription-key': azureMapsKey
      }
    });

    const features = response.data.features.map((feature) => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.properties
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('Error proxying geocode request:', error);
    res.status(500).json({ error: 'Failed to fetch geocode data' });
  }
});

app.get('/api/coffee/find', async (req, res) => {
  const { lon, lat } = req.query;
  try {
    const response = await axios.get('https://atlas.microsoft.com/search/nearby/json', {
      params: {
        'api-version': '1.0',
        lat,
        lon,
        categorySet: 9376006,
        'subscription-key': azureMapsKey
      }
    });

    const features = response.data.results.map((result, idx) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [result.position.lon, result.position.lat]
      },
      properties: {
        id: result.id,
        name: result.poi?.name,
        phone: result.poi?.phone,
        address: result.address?.freeformAddress,
        url: result.poi?.url,
        categories: result.poi?.categories,
        score: result.score,
        distance: result.dist,
        rank: (idx+1)
      }
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('Error proxying coffee search request:', error);
    res.status(500).json({ error: 'Failed to fetch coffee shop data' });
  }
});

app.get('/api/neighborhoods/find', async (req, res) => {
  const { lon, lat } = req.query;
  try {
    const query = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(geom)::jsonb,
            'properties', to_jsonb(row) - 'geom'
          )
        )
      ) AS geojson
      FROM (
        SELECT id, name, description, geom
        FROM public.boston_neighborhood_boundaries
        WHERE ST_Contains(
          geom,
          ST_SetSRID(ST_Point($1, $2), 4326)
        )
      ) AS row;
    `;
    const result = await pgPool.query(query, [lon, lat]);
    res.json(result.rows[0].geojson);
  } catch (error) {
    console.error('Error querying neighborhoods:', error);
    res.status(500).json({ error: 'Failed to fetch neighborhood data' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'static'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store');
  }
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
