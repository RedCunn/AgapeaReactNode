//modulo de node para definir endpoints zona Tienda con sus respectivas funciones middleware para su procesamiento
//se meten en objeto router y se exporta este objeto router:
const express = require('express');
const router = express.Router(); //<----- objeto router a exportar...

const TiendaController = require('../controllers/TiendaController');

router.get('/retrieveCategories/:idcategoria', TiendaController.retrieveCategories);
router.get('/retrieveBooks/:idcategoria', TiendaController.retrieveBooks);
router.get('/retrieveSingleBook/:isbn13', TiendaController.retrieveSingleBook);


module.exports = router;