const {Router} = require('express');
const router = Router();
const {registerUser, loginUser} = require ('../controller/auth.controller');
const { checkDuplicateUsernameOrEmail, checkRolesExisted} = require('../middleware/verifyAuth');

router.post('/register',[checkDuplicateUsernameOrEmail, checkRolesExisted],registerUser);

router.post('/login', loginUser);








module.exports = router;