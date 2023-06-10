const {Router} = require('express');
const { createProductInventory, findAllProductsInventory, updateInventoryProduct, getProductById, deleteProduct, moveProductToStore } = require('../controller/invetory.controller');


const router = Router();

router.post('/add-inventory', createProductInventory)
router.get('/all-products-inventory', findAllProductsInventory);

router.post('/update-inventory-product', updateInventoryProduct)

router.get('/one-product-inventory/:id', getProductById)

router.delete('/delete-product-inventory/:id', deleteProduct)
router.post('/move-to-store', moveProductToStore)



module.exports = router;