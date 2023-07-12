const {Router} = require('express');
const { createSeller, findAll, findOne, editSeller, deleteSeller, searchSellerByCode, getSalesStats, getProductsBySeller, deleteSoldProduct } = require('../controller/seller.controller');
const { getProductById } = require('../controller/invetory.controller');
const { getSellerDebt } = require('../controller/loan.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();




router.post('/create-seller',authJwt.verifyToken, authJwt.isAdmin, createSeller)
router.get('/find-all',authJwt.verifyToken, authJwt.isAdmin, findAll );
router.get('/find-one/:id',authJwt.verifyToken, authJwt.isAdmin, findOne)
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, editSeller);
router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteSeller)
router.get('/search-query',authJwt.verifyToken, authJwt.isAdminOrFacturacion, searchSellerByCode)
router.get('/seller-stast/:sellerId',authJwt.verifyToken, authJwt.isAdmin, getSalesStats);
router.get('/seller-product-sales/:sellerId',authJwt.verifyToken, authJwt.isAdmin, getProductsBySeller)
router.get('/seller/:sellerId/debt',authJwt.verifyToken, authJwt.isAdmin, getSellerDebt);
router.delete('/seller/:id/products/:productId',authJwt.verifyToken, authJwt.isAdmin, deleteSoldProduct)




module.exports = router;