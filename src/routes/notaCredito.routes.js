const {Router} = require('express');
const { findAllNota, editNota, obtenerUnaNota } = require('../controller/notaCredito.controller');
const router = Router();




router.get('/all-notes', findAllNota);
router.put('/update/:id', editNota);
router.get('/one-nota/:id', obtenerUnaNota)








module.exports = router;
