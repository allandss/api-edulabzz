const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/tracks', require('./tracking'));

module.exports = router;