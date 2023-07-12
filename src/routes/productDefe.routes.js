const {Router} = require('express');
const { getProducts, updateProductDefectuoso, createProductd, deleteMultipleProductsDefec } = require('../controller/productosDefe.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();

router.post('/create',authJwt.verifyToken, authJwt.isAdmin, createProductd)
router.get('/all',authJwt.verifyToken, authJwt.isAdmin, getProducts);
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, updateProductDefectuoso);
router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteMultipleProductsDefec)
router.delete('/delete-multiply',authJwt.verifyToken, authJwt.isAdmin, deleteMultipleProductsDefec)







module.exports = router