const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/', (req, res) => {
  let mapApiKey = {
    apiKey: process.env.MAP_API_KEY,
    crashRiskAPI: process.env.CRASH_RISK_API
  };
  res.render('index', { mapApiKey: JSON.stringify(mapApiKey) });
});

module.exports = router;
