const {Router}=require('express');
const { createLoan, getLoansBySeller, getAllLoan, updateLoanStatus, deleteLoan } = require('../controller/loan.controller');


const router = Router();

router.get('/get-all', getAllLoan);
router.get('/get/:id', getLoansBySeller);
router.post('/create', createLoan);
router.put('/update', updateLoanStatus);
router.delete('/delete', deleteLoan);











module.exports=router