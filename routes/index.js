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
    realtimeDiagnosticsAPI: process.env.REALTIME_DIAGNOSTICS_API,
  };
  res.render('index', { mapApiKey: JSON.stringify(mapApiKey) });
});

router.get('/calendar', function(req, res) {
  res.render('report', {}); 
});

router.get('/report', function(req, res) {
  res.render('report', {}); 
});

router.get('/fullmap', function(req, res) {
  let mapApiKey = {
    apiKey: process.env.MAP_API_KEY,
    crashRiskAPIBasic: process.env.CRASH_RISK_API_BASIC,
    crashRiskAPIMerge: process.env.CRASH_RISK_API_MERGE,
    crashRiskAPIDiverge: process.env.CRASH_RISK_API_DIVERGE,
    crashRiskAPIRamp: process.env.CRASH_RISK_API_RAMP,
    crashRiskAPISpecific: process.env.CRASH_RISK_API_SPECIFIC,
    crashRiskAPIWeaving: process.env.CRASH_RISK_API_WEAVING,
    realtimeDiagnosticsAPI: process.env.REALTIME_DIAGNOSTICS_API,
  };
  
  // Pass the mapApiKey to the fullmap view
  res.render('fullmap', { mapApiKey: JSON.stringify(mapApiKey) });
});

module.exports = router;
