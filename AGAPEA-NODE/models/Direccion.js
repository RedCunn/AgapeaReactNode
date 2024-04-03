const mongoose = require('mongoose');

var direccionSchema = new mongoose.Schema(
    {

    calle: {type: String,required:[true,'* Calle requerida']},
    cp : {type: String,required:[true,'* Código postal requerido'],match:[/^\d{5}$/,'* Formato: 12345']},
    pais: {type: String,default:'España'},
    provincia:{
        CPRO:{type:String,required:true},
        CCOM:{type:String, required:true},
        PRO:{type:String, required:true}
    },
    municipio:{
        CPRO:{type:String, required:true},
        CMUM:{type:String, required:true},
        DMUN50:{type:String, required:true},
        CUN:{type:String, required:true}
    },
    esPrincipal:{type:Boolean,default:false},
    esFacturacion:{type:Boolean,default:false}
    }
);

module.exports=mongoose.model('Direccion',direccionSchema,'direcciones');

//invocacion restapi publico GEO-API para obtener provincias (EN PROPIEDAD .data de la respuesta estan los datos):
// invoke-restmethod -Method get -Uri 'https://apiv1.geoapi.es/provincias?type=JSON&key=&sandbox=1'
//para obtener municipios:
// invoke-restmethod -Method get -Uri 'https://apiv1.geoapi.es/municipios?CPRO=28&type=JSON&key=&sandbox=1'

