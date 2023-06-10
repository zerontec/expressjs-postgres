const {Router}= require('express');
const { createAccountsReceivable, getAllAccountsReceivable, getAccountsReceivable,updateAccountsReceivable, deleteAccountsReceivable } = require('../controller/accountsReceivable.controller');


const router = Router()


router.post('/create-account', createAccountsReceivable);
router.get('/all-account', getAllAccountsReceivable);
router.get('/detail-account/:id', getAccountsReceivable )
router.put('/update-account/:id', updateAccountsReceivable);
router.delete('/delete-account/:id', deleteAccountsReceivable);









module.exports=router;