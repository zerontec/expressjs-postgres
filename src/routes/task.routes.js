const {Router} = require('express');
const { crearTarea, actualizarTarea, obtenerTareaPorId, eliminarTarea, tomarTarea, terminarTarea, obtenerTodasLasTareas, cancelarTarea, getTareasAsignadas, obtenerTareasTerminadasTecnico, obtenerTareasEnProgreso, obtenerTodasTareasTerminadas, obtenerTareasPendiente, obetenrHistorialTerminada, obtenerTareasFinalizadasPorId, obtenerTareasTerminadasTecnicoA } = require('../controller/task.controller');


const router = Router();





router.post('/create', crearTarea );
router.put('/update/:id', actualizarTarea);
router.get('/all', obtenerTodasLasTareas);
router.get('/task/:id', obtenerTareaPorId);
router.delete('/delete/:id', eliminarTarea);
router.post('/take/:id/:tecnico_id', tomarTarea);
router.post('/task-finish/:id/:tecnico_id', terminarTarea);
router.post('/reject/:id/:tecnicoId', cancelarTarea);
router.get('/assigned/:tecnico_id', getTareasAsignadas);



router.get('/finish-task-tec/:tecnicoId', obtenerTareasTerminadasTecnico);
router.get('/finish-task-teca/:tecnicoId', obtenerTareasTerminadasTecnicoA);
router.get('/task-progress', obtenerTareasEnProgreso);
router.get('/task-finish', obtenerTodasTareasTerminadas);
router.get('/pending', obtenerTareasPendiente);
router.get('/finish-historial', obetenrHistorialTerminada);

router.get('/finish-historial/:id', obtenerTareasFinalizadasPorId);


module.exports = router;
