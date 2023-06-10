const {Router}= require('express');
const { generatePdfNotaCredito } = require('../until/pdfgenerator');

const router = Router();




router.post('/notaCredito/:id', generatePdfNotaCredito);








module.exports=router