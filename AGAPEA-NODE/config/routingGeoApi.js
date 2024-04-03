const express=require('express');
const geoApiController = require('../controllers/GeoApiController');

let router = express.Router();

router.get('/ObtenerProvincias',geoApiController.obtenerProvincias);
router.get('/ObtenerMunicipios',geoApiController.obtenerMunicipios);

module.exports=router;