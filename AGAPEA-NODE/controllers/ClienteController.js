const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const multer = require('multer');

var Cliente = require('../models/Cliente');
var Categoria = require('../models/Categoria');
var Direccion = require('../models/Direccion');
var Pedido = require('../models/Pedido');
var Libro = require('../models/Libro');
var Valoracion = require('../models/Valoracion');

module.exports = {
    login: async (req, res, next) => {
        try {

            let { email, password } = req.body;

            let _cliente = await Cliente.findOne({ 'cuenta.email': email })
                .populate(
                    [
                        { path: 'direcciones', model: 'Direccion' },
                        { path: 'pedidos', model: 'Pedido', populate: [{ path: 'elementosPedido.libroElemento', model: 'Libro' }] }
                    ]
                );

            console.log(_cliente);

            if (!_cliente) throw new Error('no existe cuenta con ese email...');

            if (bcrypt.compareSync(password, _cliente.cuenta.password)) {
                if (!_cliente.cuenta.cuentaActiva) throw new Error('debes activar tu cuenta mediante el email de activación...')

                let _jwt = jsonwebtoken.sign(
                    {
                        nombre: _cliente.nombre,
                        apellidos: _cliente.apellidos,
                        email: _cliente.cuenta.email,
                        idCliente: _cliente.id
                    },
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn: '1h',
                        issuer: 'http://localhost:3003'
                    }
                );

                res.status(200).send({
                    codigo: 0,
                    mensaje: 'login OK',
                    error: '',
                    datoscliente: _cliente,
                    tokensession: _jwt,
                    otrosdatos: null,
                    redirectTo: '/Tienda/Librosv2'
                });


            } else {
                throw new Error('password incorrecta....');
            }

        } catch (error) {
            console.log('error en el login...', error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Login fallido',
                error: error.message,
                datoscliente: null,
                tokensession: null,
                otrosdatos: null
            });
        }
    },

    register: async (req, res, next) => {


        console.log('datos recibidos por el cliente react en componente registro, por ajax...', req.body);

        //1º paso : con los datos mandados por el componente de react, tenemos que insertarlos en la coleccion clientes de la bd de mongo

        try {
            // 1 ) obtener los datos 

            const emailtrim = req.body.email.trim();
            const logintrim = req.body.login.trim();

            // 2 ) verificar que el user no exista

            let existingEmail = await Cliente.findOne({ 'cuenta.email': emailtrim });
            let existingLogin = await Cliente.findOne({ 'cuenta.login': logintrim });

            if (existingEmail != null) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Este email ya está registrado.'
                    });
            }

            if (existingLogin != null) {
                return res.status(400).json({
                    success: false,
                    message: 'Este nombre de user ya está en uso.'
                });
            }
            // 3 ) generar codigo 

            const code = uuidv4();
            console.log(code);

            // 4 ) crear nuevo user

            var __clientInsertResult = await new Cliente(
                {
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    cuenta: {
                        email: req.body.email,
                        login: req.body.login,
                        password: bcrypt.hashSync(req.body.password, 10),
                        cuentaActiva: req.body.cuentaActiva,
                        accountPic: ''
                    },
                    telefono: req.body.telefono
                }
            ).save();

            console.log('Resultado del insert en la collection cliente de mongodb: ', __clientInsertResult);

            //PENDIENTE email activacion

            res.status(200)
                .send({
                    codigo: 0,
                    respuesta: 'endpoint a la escucha para el registro de datos'
                })
        } catch (err) {
            console.log('error al hacer insert en la collection...', err);
            res.status(200).send({
                code: 1,
                message: `error al insertar datos del cliente: ${JSON.stringify(err)}`
            })
        }

    },

    retrieveClientData: async (req, res, next) => {
        try {
            console.log('payload en el jwt de un solo uso...', req.payload);
            console.log('datos mandados en el body por el servicio de react restClienteService...', req.body);

            let { idcliente, idpedido, idpago } = req.payload;
            let _idcliente = req.body.idcliente;

            if (_idcliente !== idcliente) {
                throw new Error('alguien ha manipulado los datos mandados en el body de la pet.post, no coincide con lo almacenado en el JWT...ojito');
            } else {

                let _cliente = await Cliente.findById(idcliente).populate(
                    [
                        { path: 'direcciones', model: 'Direccion' },
                        { path: 'pedidos', model: 'Pedido', populate: [{ path: 'elementosPedido.libroElemento', model: 'Libro' }] }
                    ]
                );

                //token de sesion para datos del cliente actualizados....
                let _jwt = jsonwebtoken.sign(
                    { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                    process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                    { expiresIn: '1h', issuer: 'http://localhost:3003' } //opciones o lista de cliams predefinidos
                );

                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'datos cliente recuperados ok con nuevo pedido metido y nuevo JWT de sesion creado',
                        error: null,
                        datoscliente: _cliente,
                        tokensesion: _jwt,
                        otrosdatos: null
                    }
                )

            }

        } catch (error) {
            console.log('error al obtener datos cliente...', error);
            res.status(401).send(
                {
                    codigo: 1,
                    mensaje: 'error al obtener datos cliente y generar nuevo JWT de sesion tras pago con paypal...',
                    error: error.message,
                    datoscliente: null,
                    tokensesion: null,
                    otrosdatos: null
                }
            )
        }


    },
    uploadProfileImage: async (req, res, next) => {
        try {

            console.log(req.headers['content-type']);

            const boundary = req.headers['content-type'].split('boundary=')[1];
            let body = '';

            req.on('data', (chunk) => (body += chunk));

            req.on('end', () => {
                body.split(boundary).map((data, index) => console.log(index, data));
            });

            res.status(200).send({
                codigo: 0,
                mensaje: 'subida de imagen exitosa en server, ya te pongo cara',
                error: error.message,
                datoscliente: null,
                tokensesion: null,
                otrosdatos: null
            });

        } catch (error) {

        }
    },
    modifyAccountData: async (req, res, next) => {
        try {
            let { email } = req.body;

            let _cliente = await Cliente.findOne({ 'cuenta.email': email })
                .populate(
                    [
                        { path: 'direcciones', model: 'Direccion' },
                        { path: 'pedidos', model: 'Pedido', populate: [{ path: 'elementosPedido.libroElemento', model: 'Libro' }] }
                    ]
                );

            console.log(_cliente);
            const { nombre, apellidos, password, reppassword, login, telefono, genero, fecha_nacimiento, descripcion } = req.body;

            _cliente.nombre = nombre;
            _cliente.apellidos = apellidos;
            if (password) {
                if (password === reppassword)
                    _cliente.cuenta.password = bcrypt.hashSync(password, 10);
            }
            _cliente.cuenta.login = login;
            _cliente.telefono = telefono;
            _cliente.cuenta.genero = genero;
            _cliente.cuenta.fecha_nacimiento = fecha_nacimiento;
            _cliente.cuenta.descripcion = descripcion;


            const clienteActualizado = await _cliente.save();
            console.log('Modificaciones salvadas.');
            return res.status(200).json({ mensaje: 'Cliente actualizado con éxito', cliente: clienteActualizado });

        } catch (error) {
            console.log('error al salvar las modificaciones...', error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Modificaciones no persistidas',
                error: error.message,
                datoscliente: null,
                tokensession: null,
                otrosdatos: null
            });
        }
    },
    retrieveOrders: async (req, res, next) => {

        try {
            let { email } = req.body;

            let _cliente = await Cliente.findOne({ 'cuenta.email': email })
                .populate([
                    { path: 'direcciones', model: 'Direccion' },
                    {
                        path: 'pedidos',
                        model: 'Pedido',
                        populate: [{ path: 'elementosPedido.libroElemento', model: 'Libro' }]
                    }

                ]
                );

            console.log(_cliente);

            res.status(200).send({
                codigo: 0,
                mensaje: 'pedidos recuperados',
                error: '',
                datoscliente: _cliente,
                tokensession: null,
                otrosdatos: null
            });
        } catch (error) {
            console.log('error al recuperar pedidos...', error);
        }


    },
    saveReview: async (req, res, next) =>{
        try {
            let { email } = req.body;
            let _cliente = await Cliente.findOne({ 'cuenta.email': email });

            console.log('CLIENTE POPULADO ----------------'._cliente);


            let {comentario} = req.body;

            console.log('comentario reqbody...........',comentario);
            
            
                var __reviewInsertResult = await new Valoracion(
                    {
                        puntuacion: comentario.puntuacion,
                        comentario: comentario.comentario,
                        libro: comentario.libro,
                        user: comentario.user
                    }
                ).save();
    
                console.log('Resultado del insert en la collection cliente-valoraciones de mongodb: ', __reviewInsertResult);


                res.status(200)
                .send({
                    codigo: 0,
                    respuesta: 'endpoint a la escucha para el registro de datos'
                })

        } catch (error) {
            console.log('error al hacer insert en la collection...', error);
            res.status(200).send({
                code: 1,
                message: `error al insertar datos del cliente: ${JSON.stringify(error)}`
            })
        }
    }
}
