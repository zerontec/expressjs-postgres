const {Router} = require('express');
const { createSeller, findAll, findOne, editSeller, deleteSeller, searchSellerByCode, getSalesStats, getProductsBySeller } = require('../controller/seller.controller');
const { getProductById } = require('../controller/invetory.controller');
const router = Router();




router.post('/create-seller', createSeller)
router.get('/find-all', findAll );
router.get('/find-one/:id', findOne)
router.put('/update/:id', editSeller);
router.delete('/delete/:id', deleteSeller)
router.get('/search-query', searchSellerByCode)
router.get('/seller-stast/:sellerId', getSalesStats);
router.get('/seller-product-sales/:sellerId', getProductsBySeller)





module.exports = router;