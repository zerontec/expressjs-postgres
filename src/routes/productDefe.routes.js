const {Router} = require('express');
const { getProducts, updateProductDefectuoso, createProductd, deleteMultipleProductsDefec } = require('../controller/productosDefe.controller');


const router = Router();

router.post('/create', createProductd)
router.get('/all', getProducts);
router.put('/update/:id', updateProductDefectuoso);
router.delete('/delete/:id', deleteMultipleProductsDefec)
router.delete('/delete-multiply', deleteMultipleProductsDefec)







module.exports = router