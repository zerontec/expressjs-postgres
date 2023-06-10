const {Router} = require('express');
const { createSeller, findAll, findOne, editSeller, deleteSeller, searchSellerByCode } = require('../controller/seller.controller');
const router = Router();




router.post('/create-seller', createSeller)
router.get('/find-all', findAll );
router.get('/find-one/:id', findOne)
router.put('/update/:id', editSeller);
router.delete('/delete/:id', deleteSeller)
router.get('/search-query', searchSellerByCode)







module.exports = router;