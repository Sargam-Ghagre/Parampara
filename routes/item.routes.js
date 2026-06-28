const express = require('express');

const router = express.Router();

const { getItems, createItem } = require('../controllers/item.controller');
const moderateContent = require('../middleware/moderation');

router.get('/', getItems);

router.post('/', moderateContent({ action: 'block', fields: ['title', 'description', 'location'] }), createItem);

module.exports = router;
