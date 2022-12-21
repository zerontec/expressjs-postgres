const {Router} = require('express');
const router = Router();
const {getUser, createUser, getAllUser, putUser, deleteUser, searchUser} = require('../controller/user.controller');
const authJwt = require('../middleware/authJwt');


router.post('/create-user',authJwt.verifyToken, authJwt.isAdmin, createUser);
router.get( '/get-all-users',authJwt.verifyToken, authJwt.isAdmin, getAllUser);
router.get('/get-user/:id',authJwt.verifyToken, authJwt.isAdmin, getUser);
router.put('/put-user/:id',authJwt.verifyToken, authJwt.isAdmin, putUser);
router.delete('/delete-user/:id',authJwt.verifyToken, authJwt.isAdmin, deleteUser);
router.get('/', searchUser);



 


module.exports = router;

