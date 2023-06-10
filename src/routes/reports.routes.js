const {Router} = require('express');
const { getDailySales } = require('../controller/dailySales.controller');

const router = Router()




router.get('/daily-sales', getDailySales);





module.exports = router;







