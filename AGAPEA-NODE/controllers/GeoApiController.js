const axios = require('axios');

module.exports={
    obtenerProvincias: async(req,res,next)=>{
        try {
            let _resp = await axios.getAdapter(`https://apiv1.geoapi.es/provincias?type=JSON&key=${process.env.GEO_API_KEY}&sandbox=0`);
            res.status(200).send({
                codigo: 0,
                mensaje: 'provincias recuperadas desde GeoAPi ALLRIGHT',
                error: error.message,
                datoscliente:null,
                tokensession: null,
                otrosdatos: JSON.stringify(_resp.data.data)
            });
            
        } catch (error) {
            console.log('error al recuperar provincias desde GeoApi...',error);
            res.status(301).send({
                codigo: 1,
                mensaje: 'error al recuperar provincias desde GeoAPi',
                error: error.message,
                datoscliente:null,
                tokensession: null,
                otrosdatos: null
            });
        }
    },
    obtenerMunicipios: async(req,res,next)=>{
        try {
            let _resp = await axios.getAdapter(`https://apiv1.geoapi.es/municipios?CPRO=${req.params.codprov}&type=JSON&key=${process.env.GEO_API_KEY}&sandbox=0`);
            res.status(200).send({
                codigo: 0,
                mensaje: 'municipios recuperadas desde GeoAPi ALLRIGHT',
                error: error.message,
                datoscliente:null,
                tokensession: null,
                otrosdatos: JSON.stringify(_resp.data.data)
            });
            
        } catch (error) {
            console.log('error al recuperar municipios desde GeoApi...',error);
            res.status(301).send({
                codigo: 1,
                mensaje: 'error al recuperar municipios desde GeoAPi',
                error: error.message,
                datoscliente:null,
                tokensession: null,
                otrosdatos: null
            });
        }
    }
}