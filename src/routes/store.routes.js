const {Router} = require('express');
const { createSeller } = require('../controller/seller.controller');
const { getAllProducts } = require('../controller/store.controller');
const router = Router();




router.get('/get-all-products', getAllProducts)








module.exports = router;