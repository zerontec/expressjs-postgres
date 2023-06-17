const {Router}= require('express');
const consultarDolar = require('../controller/dolar.controller');

const router = Router();


router.get('/dolar', consultarDolar)

module.exports = router;