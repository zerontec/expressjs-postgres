const {Router} = require('express');

const { createPurchase, findAllPurchase, updatePurchase, detailPurchase, deletepurchase } = require('../controller/purchase.controller');


const router = Router();

router.post('/create-purchase', createPurchase);
router.get('/all-purchase', findAllPurchase);
router.put('/update/:id', updatePurchase);
router.get('/detail-purchase/:id', detailPurchase);
router.delete('/delete-purchase/:id', deletepurchase)








module.exports = router;