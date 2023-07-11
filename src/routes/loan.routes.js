const {Router}=require('express');
const { createLoan, getLoansBySeller, getAllLoan, updateLoanStatus, deleteLoan, createPayment, updatePayment, getCompletedPayments } = require('../controller/loan.controller');


const router = Router();

router.get('/get-all', getAllLoan);
router.get('/get/:id', getLoansBySeller);
router.post('/create', createLoan);
router.put('/update/:id', updateLoanStatus);
router.delete('/delete/:id', deleteLoan);
router.post('/payment', createPayment)
router.put('/update-payment/:id', updatePayment);
router.get('/get-all-payment', getCompletedPayments)
// router.delete('/delete/:id', deleteLoan);











module.exports=router