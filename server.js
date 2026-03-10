// Simple CORS proxy for Tabit API
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const TABIT_BASE = 'https://ros-rp.tabit.cloud';
const CLIENT_ID = 'syiU5W2pTidPMXd5t5nTzg';
const ORG_ID = '646c70c4bc858170a500ef8c';

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  
  const response = await axios.post(`${TABIT_BASE}/oauth2/token`, 
    `grant_type=client_credentials&client_id=${CLIENT_ID}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  
  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (3600 * 1000); // 1 hour
  return cachedToken;
}

app.get('/api/daily-totals', async (req, res) => {
  try {
    const token = await getToken();
    const today = new Date().toISOString().split('T')[0];
    
    const response = await axios.get(`${TABIT_BASE}/reports/daily-totals`, {
      params: { 
        startDate: req.query.startDate || today,
        endDate: req.query.endDate || today
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'ros-organization': ORG_ID
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/organizations', async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios.get(`${TABIT_BASE}/organizations`, {
      params: { 'x-multiSite': 'true' },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard endpoints:`);
  console.log(`   - GET /api/daily-totals`);
  console.log(`   - GET /api/organizations`);
});
