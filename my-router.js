const express = require('express');
const router = express.Router(); //creates a new route instance

router.get('/', (req, res) => {
    res.send('get')
})

router.get("/contacts", (req, res) => {
    res.send('contacts')
})

module.exports = router;