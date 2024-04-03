const mongoose=require('mongoose');

var CategoriaSchema = new mongoose.Schema({
    IdCategoria:{type:String, required:true},
    NombreCategoria:{type:String, required:true}
});

module.exports = mongoose.model('Categoria',CategoriaSchema,'categorias');