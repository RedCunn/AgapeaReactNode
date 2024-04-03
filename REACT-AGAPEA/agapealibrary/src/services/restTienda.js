var tiendaRESTService = {
    retrieveCategories: async function ({request,params}){
        try{
            var _idCategoria = params.idCategoria;
            if(typeof(_idCategoria)==='undefined') _idCategoria='roots';
            var _cats = await fetch(`http://localhost:3003/api/Tienda/retrieveCategories/${_idCategoria}`);
            return await _cats.json();
        }catch(error){
            return [];
        }
    },
    retrieveBooks: async function ({request, params}){
        try {
            var _idCategoria = params.idCategoria;
            
            if(typeof(_idCategoria)==='undefined') _idCategoria = '2-10';
            
            var _libros = await fetch(`http://localhost:3003/api/Tienda/retrieveBooks/${_idCategoria}`);
            return await _libros.json();
        } catch (error) {
         return [];   
        }
    },
    retrieveSingleBook: async function (isbn13){
        try {
            var _libro = await fetch(`http://localhost:3003/api/Tienda/retrieveSingleBook/${isbn13}`);
            return await _libro.json();
        } catch (error) {
            return{};
        }
    }               
}

export default tiendaRESTService;