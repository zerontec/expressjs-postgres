const {Router} = require('express');

const {searchPurchaseByQueryI,searchPurchaseByQuery, createPurchase, findAllPurchase, updatePurchase, detailPurchase, deletepurchase } = require('../controller/purchase.controller');


const router = Router();

router.post('/create-purchase', createPurchase);
router.get('/all-purchase', findAllPurchase);
router.put('/update/:id', updatePurchase);
router.get('/detail-purchase/:id', detailPurchase);
router.delete('/delete-purchase/:id', deletepurchase)
router.get('/search-query',searchPurchaseByQuery )

router.get('/search-query-p',searchPurchaseByQueryI )






module.exports = router;