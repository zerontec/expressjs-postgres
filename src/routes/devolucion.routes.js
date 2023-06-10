const {Router} = require('express');
const { crearDevolucion, obtenerDevolucionesVentas, obtenerDevolucionVenta, editDevolucion } = require('../controller/devoluciones.controller');
const router = Router();





router.post('/create-devolucion', crearDevolucion);
router.get('/all-devolucion', obtenerDevolucionesVentas);
router.get('/one/:id', obtenerDevolucionVenta)
router.put('/update/:id', editDevolucion )






module.exports=router