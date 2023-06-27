const {Router} = require('express');
const { crearDevolucionCompra } = require('../controller/devolucionCompra.controller');

const router = Router();





router.post('/devolucion', crearDevolucionCompra);
// router.get('/all-devolucion', obtenerDevolucionesVentas);
// router.get('/one/:id', obtenerDevolucionVenta)
// router.put('/update/:id', editDevolucion )






module.exports=router