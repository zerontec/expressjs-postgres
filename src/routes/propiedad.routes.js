const {Router} = require('express');
const { createPropietir, findAll, findOne, putPropierti, deleteProperti, getAllPropierti } = require('../controller/propiedad.Controller');
const authJwt = require('../middleware/authJwt');
const router = Router();



router.post('/create',authJwt.verifyToken, authJwt.isAdmin, createPropietir);

// router.get('/all', findAll);
router.get('/all',getAllPropierti)
router.get('/detail-propiedad/:id', findOne);
router.put('/edit/:id',authJwt.verifyToken, authJwt.isAdmin,  putPropierti);
router.delete('/deleted/:id',authJwt.verifyToken, authJwt.isAdmin, deleteProperti)





module.exports= router