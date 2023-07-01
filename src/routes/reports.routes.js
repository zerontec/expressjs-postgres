const {Router} = require('express');
const { getDailySales } = require('../controller/dailySales.controller');
const { generateDailyReport, getClientPurchases, getClientTotalPurchases, getInvoicesByDateRange } = require('../controller/reports.controller');
const router = Router()




router.get('/daily-sales', getDailySales);

router.get('/daily-report/:startDate/:endDate', generateDailyReport);


// router.get('/client-purchases/:id', getClientPurchases)

router.get('/client-stat/:id', getClientTotalPurchases)

router.get('/invoices-by-date-range/:startDate/:endDate', getInvoicesByDateRange);






module.exports = router;







