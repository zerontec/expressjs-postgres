const {Router} = require('express');
const { createSeller, findAll, findOne, editSeller, deleteSeller, searchSellerByCode, getSalesStats, getProductsBySeller, deleteSoldProduct } = require('../controller/seller.controller');
const { getProductById } = require('../controller/invetory.controller');
const { getSellerDebt } = require('../controller/loan.controller');
const router = Router();




router.post('/create-seller', createSeller)
router.get('/find-all', findAll );
router.get('/find-one/:id', findOne)
router.put('/update/:id', editSeller);
router.delete('/delete/:id', deleteSeller)
router.get('/search-query', searchSellerByCode)
router.get('/seller-stast/:sellerId', getSalesStats);
router.get('/seller-product-sales/:sellerId', getProductsBySeller)
router.get('/seller/:sellerId/debt', getSellerDebt);
router.delete('/seller/:id/products/:productId', deleteSoldProduct)




module.exports = router;