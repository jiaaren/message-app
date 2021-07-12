const express = require('express');
const router = express.Router();

// Set route to index '/'
router.get('/', (req, res) => {
    res.render('welcome');
})

// Export router for use in app.js
module.exports = router;