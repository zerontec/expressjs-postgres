const {Router} = require('express');
const {getAllQuantityProduct, getAllQuantity,serachProductByQuery,updateProduct,moveProductToStoreA,createProduct, updateProductQuantity, getProducts, deleteProductP, deleteMultipleProducts } = require('../controller/product.controller');

const router = Router();



router.post('/create', createProduct);

router.put('/update/:id', updateProduct);
router.get('/all', getProducts)
router.delete('/delete/:id', deleteProductP)
router.delete('/delete-multiply', deleteMultipleProducts)
router.post('/move-to-store', moveProductToStoreA)
router.get('/search-query', serachProductByQuery)
router.get('/all-quantiy', getAllQuantity);
router.get('/all-quantity-product', getAllQuantityProduct)





module.exports = router;