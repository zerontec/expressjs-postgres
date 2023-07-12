const {Router} = require ('express');
const {buscarClientePorIdentificacion, createCustomer, findAllCustomer, FindCustomertByCedula, searchCustomer, numberCustomer, deleteCustomer, editCustomer, SearchCustomerById } = require('../controller/customer.controller');
const authJwt = require('../middleware/authJwt');


const router = Router()


router.post('/create',authJwt.verifyToken, authJwt.isAdmin, createCustomer)
router.get('/find-all',authJwt.verifyToken, authJwt.isAdmin, findAllCustomer)
router.get('/find-id/:id',authJwt.verifyToken, authJwt.isAdmin, FindCustomertByCedula);
router.post('/search',authJwt.verifyToken, authJwt.isAdmin, searchCustomer);
router.get('/number-customer',authJwt.verifyToken, authJwt.isAdmin, numberCustomer);


router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteCustomer);
router.put('/update/:id', authJwt.verifyToken, authJwt.isAdmin,editCustomer);

router.get('/search-query',authJwt.verifyToken,authJwt.isAdminOrFacturacion,  buscarClientePorIdentificacion)
router.get('/search/:id',authJwt.verifyToken, authJwt.isAdmin, SearchCustomerById)

module.exports = router