const {Router}= require('express');
const { getDailySalesReport, getAllClosure } = require('../controller/CierreVenta');

const authJwt = require('../middleware/authJwt');

const router = Router();


router.get('/sales-report', getDailySalesReport)
router.get('/get-all', getAllClosure)





module.exports = router