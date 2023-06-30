const {Router} = require ('express');
const {buscarClientePorIdentificacion, createCustomer, findAllCustomer, FindCustomertByCedula, searchCustomer, numberCustomer, deleteCustomer, editCustomer, SearchCustomerById } = require('../controller/customer.controller');


const router = Router()


router.post('/create', createCustomer)
router.get('/find-all', findAllCustomer)
router.get('/find-id/:id', FindCustomertByCedula);
router.post('/search', searchCustomer);
router.get('/number-customer', numberCustomer);


router.delete('/delete/:id', deleteCustomer);
router.put('/update/:id', editCustomer);

router.get('/search-query', buscarClientePorIdentificacion)
router.get('/search/:id', SearchCustomerById)

module.exports = router