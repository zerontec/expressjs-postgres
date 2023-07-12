const {Router} = require('express');
const {getAllQuantityProduct, getAllQuantity,serachProductByQuery,updateProduct,moveProductToStoreA,createProduct, updateProductQuantity, getProducts, deleteProductP, deleteMultipleProducts, getProductStat, crearCargaMasivaProductos, obtenerEstadisticasProducto } = require('../controller/product.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();



router.post('/create', createProduct);

router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, updateProduct);
router.get('/all',authJwt.verifyToken, authJwt.isAdmin, getProducts)
router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteProductP)
router.delete('/delete-multiply',authJwt.verifyToken, authJwt.isAdmin, deleteMultipleProducts)
router.post('/move-to-store',authJwt.verifyToken, authJwt.isAdmin, moveProductToStoreA)
router.get('/search-query',authJwt.verifyToken, authJwt.isAdminOrFacturacion, serachProductByQuery)
router.get('/all-quantiy',authJwt.verifyToken, authJwt.isAdmin, getAllQuantity);
router.get('/all-quantity-product',authJwt.verifyToken, authJwt.isAdmin, getAllQuantityProduct)
router.get('/all-product-stat', authJwt.verifyToken, authJwt.isAdmin,getProductStat)
router.post('/upload',authJwt.verifyToken, authJwt.isAdmin, crearCargaMasivaProductos)
router.get('/stast/:barcode',authJwt.verifyToken, authJwt.isAdmin, obtenerEstadisticasProducto)




module.exports = router;