const {Router} = require('express');
const router = Router();
const {serachUserByQuery,getUser, createUser, getAllUser, putUser, deleteUser, searchUser, deleteMultipleUsers} = require('../controller/user.controller');
const authJwt = require('../middleware/authJwt');


router.post('/create',authJwt.verifyToken, authJwt.isAdmin, createUser);
router.get( '/get-all',authJwt.verifyToken, authJwt.isAdmin, getAllUser);
router.get('/get/:id',authJwt.verifyToken, authJwt.isAdmin, getUser);
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, putUser);
router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteUser);
router.get('/search-query', serachUserByQuery);
router.delete('/delete-multiply',authJwt.verifyToken, authJwt.isAdmin, deleteMultipleUsers)


 


module.exports = router;

