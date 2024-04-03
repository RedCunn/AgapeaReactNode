const mongoose=require('mongoose');

var clientSchema= new mongoose.Schema(
    {
        nombre:{
            type: String,
            required:[true, '* Nombre obligatorio'],
            maxLength:[50,'* Máxima longitud de 50 caracteres']
        },
        apellidos:{
            type:String,
            required:[true, '* Apellidos obligatorios'],
            maxLength:[100,'* Máxima longitud de 100 caracteres']
        },
        cuenta:{
            email : {type:String,unique:true, required:[true, '* Email obligatorio'], match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'* el email no tiene un formato válido']},
            password : {type: String, required:[true, '* Obligada contraseña'], match:[/^(?=.*[0-9]).{8,}$/, '* la contraseña ha de tener mínimo 8 caracteres y un número']},
            cuentaActiva: {type:Boolean, default:false},
            login : {type: String,unique:true, required:[true, '* Nombre de login obligatorio'], maxLength:[30,'* no deberá tener más de 30 caracteres']},
            accountPic:{type:String, required:[false]},
            genero:{type:String, default:'' },
            fecha_nacimiento:{type:Date, default:'' },
            descripcion:{type:String, default:'' , maxlength:[200, '*max. 200 cars.']},
            valoraciones:[{type:mongoose.Schema.Types.ObjectId, ref: 'Valoracion'}]
        },
        telefono:{type:String,required:[true,'* Teléfono obligatorio'],match:[/^6\d{8}$/,'* formato móvil incorrecto, sin espacios en blanco, 9 dígitos']},
        direcciones:[{type: mongoose.Schema.Types.ObjectId, ref: 'Direccion'}],
        pedidos:[]
    }
);

module.exports=mongoose.model('Cliente',clientSchema,'clientes');
// 1º arg nombre del objeto
// 2º arg nombre del schema prototipo
// 3º arg nombre de la collection en la db 
