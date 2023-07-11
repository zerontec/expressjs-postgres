const {Router}= require('express');
const { getDailySalesReport } = require('../controller/CierreVenta');


const router = Router();


router.get('/sales-report', getDailySalesReport)







module.exports = router