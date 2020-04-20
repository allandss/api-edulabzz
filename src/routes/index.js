const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use('/api', require('./api'));

module.exports = router;

router.get('/health', auth.optional, (req, res, next) => {
    console.log('health');
    return res.json({ body: 'Server UP!' });
});