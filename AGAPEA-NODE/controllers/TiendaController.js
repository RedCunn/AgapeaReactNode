//modulo de nodejs donde exporto objeto javascript puro q tiene como propiedades las funciones middleware
//q necesita el objeto router express de zona Tienda....
var Cliente = require('../models/Cliente');
var Categoria = require('../models/Categoria');
var Direccion = require('../models/Direccion');
var Pedido = require('../models/Pedido');
var Libro = require('../models/Libro');

module.exports = {
    retrieveCategories: async (req, res, next) => {
        try {
            var idcategoria = req.params.idcategoria;

            var _pattern = idcategoria === 'roots' ? new RegExp("^\\d{1,}$") : new RegExp("^" + idcategoria + "-\\d{1,}$");
            var _cats = await Categoria.find({ IdCategoria: { $regex: _pattern } });

            res.status(200).send(_cats);


        } catch (error) {
            console.log('error al recuperar categorias...', error);
            res.status(200).send([]);
        }

    },
    retrieveBooks: async (req, res, next) => {
        try {
            
            var _idcategoria = req.params.idcategoria;
            //console.log('categoria mandada desde react...', _idcategoria);

            var _pattern = _idcategoria === 'roots' ? new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
            var _libros = await Libro.find({ IdCategoria: { $regex: _pattern } });

            //console.log('libros recuperados...', _libros);

            res.status(200).send(_libros);


        } catch (error) {
            console.log('error al recuperar categorias...', error);
            res.status(200).send([]);
        }

    },
    retrieveSingleBook: async (req, res, next) => {
        try {
            var _isbn13 = req.params.isbn13;
            var _libro = await Libro.findOne({ ISBN13: _isbn13 });
            console.log('libro recuperado...', _libro);

            res.status(200).send(_libro);

        } catch (error) {
            console.log('error al recuperar libro...', error);
            res.status(200).send({});
        }
    }
}