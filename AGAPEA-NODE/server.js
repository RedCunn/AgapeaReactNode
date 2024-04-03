//------------------- modulo principal de entrada app. nodejs config express con mongo ------------------------
// - definimos instancia de express
// - definimos instanica de mongo
// - lanzamos ambos servers...
require('dotenv').config();
var express = require('express');
var serverExpress = express();

const mongoose = require('mongoose');
const configServer = require('./config/config_pipeline');
//------------------------------------------------------------------------------------------------------------

//--------------- starting the server -------------
serverExpress.set('port', 3003);
serverExpress.listen(3003, () => console.log("I hear you 👾" + ` on port ${serverExpress.get('port')}`));
configServer(serverExpress);

//---------- conexion al servidor Mongo -----------
mongoose.connect(process.env.CONNECTION_MONGODB)
    .then(
        () => console.log('___conexion a MONGO establecida___')
    ).catch(
        (err) => console.log('fallo en la conexion a mongodb: ', err)
    );


