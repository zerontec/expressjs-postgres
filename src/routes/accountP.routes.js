const {Router}= require('express');
const { createAccountsPayable, getAllAccountsPayable, getAccountsPayable, updateAccountsPayable, deleteAccountsPayable, createPayment, getAllPagoComprasID } = require('../controller/accountPayable.controller');



const router = Router()


router.post('/create-account-payable', createAccountsPayable);
router.get('/all-account-payable', getAllAccountsPayable);
router.get('/detail-account-payable/:id', getAccountsPayable)
router.put('/update-account-payable/:id', updateAccountsPayable);
router.delete('/delete-account-payable/:id', deleteAccountsPayable);
router.post('/create-pay', createPayment);
router.post('/get-all-pay', getAllPagoComprasID);








module.exports=router;