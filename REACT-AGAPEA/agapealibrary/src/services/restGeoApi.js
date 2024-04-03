const restGeoAPi = {
    obtenerProvincias: async function(){
        
        try {
            let _respServer = await fetch('http://localhost:3003/api/GeoApi/ObtenerProvincias', {method: 'GET'});
            let _resp = await _respServer.json();    
            if(!_respServer.ok) throw new Error(_resp);

            return JSON.parse(_resp.otrosdatos);
        } catch (error) {
            console.log('error al intentar obtener provincias....',error);
            return[];
        }
        
    },

    obtenerMunicipios: async function(codprov){
        try {
            let _respServer = await fetch(`http://localhost:3003/api/GeoApi/ObtenerMunicipios/${codprov}`, {method: 'GET'});
            let _resp = await _respServer.json();    
            if(!_respServer.ok) throw new Error(_resp);

            return JSON.parse(_resp.otrosdatos);
        } catch (error) {
            console.log('error al intentar obtener municipios....',error);
            return[];
        }
        
    }
    
}

export default restGeoAPi;