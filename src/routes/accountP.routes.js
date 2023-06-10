const {Router}= require('express');
const { createAccountsPayable, getAllAccountsPayable, getAccountsPayable, updateAccountsPayable, deleteAccountsPayable } = require('../controller/accountPayable.controller');


const router = Router()


router.post('/create-account-payable', createAccountsPayable);
router.get('/all-account-payable', getAllAccountsPayable);
router.get('/detail-account-payable/:id', getAccountsPayable)
router.put('/update-account-payable/:id', updateAccountsPayable);
router.delete('/delete-account-payable/:id', deleteAccountsPayable);









module.exports=router;