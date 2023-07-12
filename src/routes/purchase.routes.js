const {Router} = require('express');

const {searchPurchaseByQueryI,searchPurchaseByQuery, createPurchase, findAllPurchase, updatePurchase, detailPurchase, deletepurchase } = require('../controller/purchase.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();

router.post('/create-purchase',authJwt.verifyToken, authJwt.isAdmin, createPurchase);
router.get('/all-purchase', findAllPurchase);
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, updatePurchase);
router.get('/detail-purchase/:id',authJwt.verifyToken, authJwt.isAdmin, detailPurchase);
router.delete('/delete-purchase/:id',authJwt.verifyToken, authJwt.isAdmin, deletepurchase)
router.get('/search-query',authJwt.verifyToken, authJwt.isAdmin,searchPurchaseByQuery )

router.get('/search-query-p',authJwt.verifyToken, authJwt.isAdmin,searchPurchaseByQueryI )






module.exports = router;