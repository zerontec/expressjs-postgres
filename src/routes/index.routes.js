const { Router } = require('express');
const router = Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const propiedadRoutes = require('./propiedad.routes')


router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/propiedad', propiedadRoutes);







module.exports = router;
