const {Router} = require('express');
const {searchSupplierByQuery, createSupplier, detailSupplier, editSupplier, findAllSupplier, deleteSupplier } = require('../controller/supplier.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();




router.post('/create-supplier',authJwt.verifyToken, authJwt.isAdmin, createSupplier)
router.get('/detail-supplier/:id',authJwt.verifyToken, authJwt.isAdmin, detailSupplier)
router.put('/update-supplier/:id',authJwt.verifyToken, authJwt.isAdmin, editSupplier);
router.get('/all-supplier',authJwt.verifyToken, authJwt.isAdmin, findAllSupplier);
router.delete('/delete-supplier/:id',authJwt.verifyToken, authJwt.isAdmin, deleteSupplier);

router.get('/search-query',authJwt.verifyToken, authJwt.isAdmin, searchSupplierByQuery)



module.exports = router;