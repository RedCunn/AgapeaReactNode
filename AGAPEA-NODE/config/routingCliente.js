//modulo de node para definir endpoints zona cliente con sus respectivas funciones middleware para su procesamiento
//se meten en objeto router y se exporta este objeto router:
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router(); //<----- objeto router a exportar...

const ClienteController = require('../controllers/ClienteController');

async function checkJWT(req, res, next) {
    try {
        //extraigo de la peticion, la cabecera "Authorization: Bearer ....jwt..."
        let _jwt = req.headers.authorization.split(' ')[1];
        console.log('JWT en cabecera mandado por cliente react...', _jwt);

        const _payload = await jsonwebtoken.verify(_jwt, process.env.JWT_SECRETKEY);
        req.payload = _payload;
        next();

    } catch (error) {
        console.log('error al intentar comprobar el JWT enviado desde el cliente react...', error);
        res.status(401)
            .send(
                {
                    codigo: 1,
                    mensaje: 'error al intentar comprobar el JWT enviado',
                    error: error.mensaje,
                    otrosdatos: null,
                    datoscliente: null,
                    jwt: null
                }
            );
    }
}

//añado endpoints y funciones middleware a ese objeto router importardas desde un objeto javascript q funciona como si fuese un "controlador":
router.post('/Login', ClienteController.login);
router.post('/Registro', ClienteController.register);
router.post('/ObtenerDatosCliente', checkJWT, ClienteController.retrieveClientData);
router.post('/UploadProfileImage', checkJWT, ClienteController.uploadProfileImage );
router.post('/ModifyData', checkJWT, ClienteController.modifyAccountData);
router.post('/Pedidos', checkJWT, ClienteController.retrieveOrders);
router.post('/valorar', checkJWT, ClienteController.saveReview);

module.exports = router;