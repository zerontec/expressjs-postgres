const {Router} = require('express');
const { getDailySales } = require('../controller/dailySales.controller');
const { generateDailyReport, getClientPurchases, getClientTotalPurchases, getInvoicesByDateRange } = require('../controller/reports.controller');
const authJwt = require('../middleware/authJwt');
const router = Router()




router.get('/daily-sales',authJwt.verifyToken, authJwt.isAdmin, getDailySales);

router.get('/daily-report/:startDate/:endDate',authJwt.verifyToken, authJwt.isAdmin, generateDailyReport);


// router.get('/client-purchases/:id', getClientPurchases)

router.get('/client-stat/:id',authJwt.verifyToken, authJwt.isAdmin, getClientTotalPurchases)

router.get('/invoices-by-date-range/:startDate/:endDate',authJwt.verifyToken, authJwt.isAdmin, getInvoicesByDateRange);






module.exports = router;







