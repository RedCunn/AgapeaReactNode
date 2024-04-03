var mongoose = require('mongoose');

var valoracionSchema= new mongoose.Schema({

    fecha: {type: Date},
    puntuacion: {type: Number, default: Date.now},
    comentario: {type: String, 
             maxLength:[100,'* Máxima longitud de 100 caracteres'],
             minLength:[15, '*Mínima longitud de 15 caracteres']},
    libro:{type:mongoose.Schema.Types.String,ref:'Libro'},
    user:{type: mongoose.Schema.Types.ObjectId, ref:'Cliente'}
})

module.exports=mongoose.model('Valoracion',valoracionSchema,'valoraciones');