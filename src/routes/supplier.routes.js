const {Router} = require('express');
const {searchSupplierByQuery, createSupplier, detailSupplier, editSupplier, findAllSupplier, deleteSupplier } = require('../controller/supplier.controller');

const router = Router();




router.post('/create-supplier', createSupplier)
router.get('/detail-supplier/:id', detailSupplier)
router.put('/update-supplier/:id', editSupplier);
router.get('/all-supplier', findAllSupplier);
router.delete('/delete-supplier/:id', deleteSupplier);

router.get('/search-query', searchSupplierByQuery)



module.exports = router;