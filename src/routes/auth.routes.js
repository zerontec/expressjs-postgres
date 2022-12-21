const {Router} = require('express');
const router = Router();
const {registerUser, loginUser} = require ('../controller/auth.controller');
const { checkDuplicateUsernameOrEmail, checkRolesExisted} = require('../middleware/verifyAuth');

router.post('/register-user',[checkDuplicateUsernameOrEmail, checkRolesExisted],registerUser);
router.post('/login-user', loginUser);








module.exports = router;