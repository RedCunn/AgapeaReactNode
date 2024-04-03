var mongoose = require('mongoose');

var pedidoSchema = new mongoose.Schema({

    fechaPedido:{type:Date,default:new Date()},
    estadoPedido:{type:String,default:"en preparación"},
    elementosPedido:[
        {
            libroElemento:{type : mongoose.Schema.Types.ObjectId, ref:'Libro'},
            cantidadElemento:{type: Number,required:true,default:1}   
        }
    ],
    subTotalPedido:{type:Number,default:0},
    gastosEnvio:{type:Number,default:3},
    totalPedido:{type:Number,default:0},
    direccionEnvio:{type:mongoose.Schema.Types.ObjectId,ref:'Direccion'},
    direccionFacturacion:{type:mongoose.Schema.Types.ObjectId,ref:'Direccion'}
});

//---------- crear metodo para calcular total del pedido en el esquema --------

pedidoSchema.methods.CalcularTotalPedido= function(){
   let total = 0;
    this.elementosPedido.forEach(element => {
        total += element.subTotalPedido;
    });

    this.totalPedido = total + this.gastosEnvio;
};

pedidoSchema.method.ContarItems = function(){
    let count = 0;
    this.elementosPedido.forEach(element =>{
       count += element.cantidadElemento; 
    });

    return count;
};

module.exports = mongoose.model('Pedido',pedidoSchema,'pedidos');