const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/', (req, res) => {
  let mapApiKey = {
    apiKey: process.env.MAP_API_KEY,
    crashRiskAPIBasic: process.env.CRASH_RISK_API_BASIC,
    crashRiskAPIMerge: process.env.CRASH_RISK_API_MERGE,
    crashRiskAPIDiverge: process.env.CRASH_RISK_API_DIVERGE,
    crashRiskAPIRamp: process.env.CRASH_RISK_API_RAMP,
    crashRiskAPISpecific: process.env.CRASH_RISK_API_SPECIFIC,
    crashRiskAPIWeaving: process.env.CRASH_RISK_API_WEAVING,

  };
  res.render('index', { mapApiKey: JSON.stringify(mapApiKey) });
});

module.exports = router;
