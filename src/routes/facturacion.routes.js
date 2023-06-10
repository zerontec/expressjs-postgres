const {Router} = require('express');
const { searchInvoiceByQuery, createInvoiceFactura, getAllInvoice, searchInvoicesByDate, getInvoiceDetails } = require('../controller/facturacion.controller');
const router = Router();




router.post('/create', createInvoiceFactura);
router.get('/all', getAllInvoice);
router.get('/one/:id', getInvoiceDetails)
router.post('/search-byDate', searchInvoicesByDate)
router.get('/search-byQuery', searchInvoiceByQuery)







module.exports = router;