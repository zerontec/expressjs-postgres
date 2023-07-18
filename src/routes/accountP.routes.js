const {Router}= require('express');
const { createAccountsPayable, getAllAccountsPayable, getAccountsPayable, updateAccountsPayable, deleteAccountsPayable, createPayment, getAllPagoComprasID } = require('../controller/accountPayable.controller');
const authJwt = require('../middleware/authJwt');



const router = Router()


router.post('/create-account-payable',authJwt.verifyToken, authJwt.isAdmin, createAccountsPayable);
router.get('/all-account-payable',authJwt.verifyToken, authJwt.isAdmin, getAllAccountsPayable);
router.get('/detail-account-payable/:id',authJwt.verifyToken, authJwt.isAdmin, getAccountsPayable)
router.put('/update-account-payable/:id', authJwt.verifyToken, authJwt.isAdmin,updateAccountsPayable);
router.delete('/delete-account-payable/:id',authJwt.verifyToken, authJwt.isAdmin, deleteAccountsPayable);
router.post('/create-pay',authJwt.verifyToken, authJwt.isAdmin, createPayment);
router.post('/get-all-pay',authJwt.verifyToken, authJwt.isAdmin, getAllPagoComprasID);








module.exports=router;