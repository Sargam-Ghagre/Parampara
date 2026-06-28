const express = require('express');

const router = express.Router();

const { getItems, createItem } = require('../controllers/item.controller');
const { cacheMiddleware } = require('../middleware/lruCache');

router.get('/', cacheMiddleware, getItems);

router.post('/', createItem);

module.exports = router;
