const {Router} = require('express');
const { crearDevolucion, obtenerDevolucionesVentas, obtenerDevolucionVenta, editDevolucion } = require('../controller/devoluciones.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();





router.post('/create-devolucion',authJwt.verifyToken, authJwt.isAdminOrFacturacion, crearDevolucion);
router.get('/all-devolucion',authJwt.verifyToken, authJwt.isAdmin, obtenerDevolucionesVentas);
router.get('/one/:id',authJwt.verifyToken, authJwt.isAdmin, obtenerDevolucionVenta)
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, editDevolucion )






module.exports=router