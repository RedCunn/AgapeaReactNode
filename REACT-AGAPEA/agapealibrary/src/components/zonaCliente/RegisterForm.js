import React, { useState } from "react";
import FormField from '../../views/FormField';
import clienteRESTservice from "../../services/restCliente";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    // const { isDarkMode, toggleTheme } = useTheme();

    // const pageStyles = {
    //     backgroundColor: isDarkMode ? '#333' : '#fff',
    //     color: isDarkMode ? '#fff' : '#333',
    // };
    //establecemos en el state del componente un objeto que tenga como props el nombre de los campos del form
    const [formData, setFormData] = useState(
        {
            email: '', repemail: '', password: '', reppassword: '', nombre: '', apellidos: '', login: '', telefono: ''
        }
    );

    async function SubmitForm(ev) {

        try {
            ev.preventDefault();

            console.log('valor del objeto del state formData....', formData);

            let { repemail, reppassword, ...datosCliente } = formData;
            let _respuestaServer = await clienteRESTservice.RegistrarCliente(datosCliente);
            console.log('Respuesta del server ante la carga de datos...' + _respuestaServer);
        } catch (error) {
            console.log('error en registro...', error);
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col">
                    <h2><strong>Registrate sin miedo 👹</strong></h2>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <Link to="/Tienda/Librosv2"><img src="/img/logo-agapea.jpg" width="280px" height="85px" alt=""/></Link>
                </div>
            </div>

            <hr />

            <div className="row">
                <div className="col">
                    <form className="row g-3" onSubmit={SubmitForm}>

                        {
                            //array de cajas del form de registro, nos creamos un comp. FormField por cada valor del array

                            [
                                {
                                    id: 'email',
                                    value: formData.email,
                                    type: 'email',
                                    name: 'email',
                                    label: 'Correo electrónico',
                                    validators: {
                                        required: [true, '* Email es obligatorio'],
                                        pattern: ['^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido']
                                    }
                                },
                                {
                                    id: 'repemail',
                                    value: formData.repemail,
                                    type: 'email',
                                    name: 'repemail',
                                    label: 'Repite tu email',
                                    validators: {
                                        required: [true, '* Email es obligatorio'],
                                        pattern: ['^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido'],
                                        compareto: ['email', '* los emails deben coincidir']
                                    }
                                },
                                {
                                    id: 'password',
                                    value: formData.password,
                                    type: 'password',
                                    name: 'password',
                                    label: 'Contraseña',
                                    validators: {
                                        required: [true, '* Contraseña es obligatoria'],
                                        pattern: ['^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                        minlength: [8, '* la contraseña debe tener al menos 8 caracteres']
                                    }
                                },
                                {
                                    id: 'reppassword',
                                    value: formData.reppassword,
                                    type: 'password',
                                    name: 'reppassword',
                                    label: 'Repite contraseña',
                                    validators: {
                                        required: [true, '* Repetir Contraseña es obligatorio'],
                                        pattern: ['^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                        minlength: [8, '* la contraseña debe tener al menos 8 caracteres'],
                                        compareto: ['password', '* las contraseñas deben coincidir']
                                    }
                                },

                                {
                                    id: 'nombre',
                                    value: formData.nombre,
                                    type: 'text',
                                    name: 'nombre',
                                    label: 'Nombre',
                                    validators: {
                                        required: [true, '* Nombre es obligatorio'],
                                        pattern: ['^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en el nombre'],
                                        minlength: [3, '* el nombre debe contener al menos 3 caracteres'],
                                        maxlength: [50, '* el nombre no puede superar los 50 caracteres']
                                    }
                                },

                                {
                                    id: 'apellidos',
                                    value: formData.apellidos,
                                    type: 'text',
                                    name: 'apellidos',
                                    label: 'Apellidos',
                                    validators: {
                                        required: [true, '* Apellidos es obligatorio'],
                                        pattern: ['^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en los apellidos'],
                                        minlength: [3, '* los apellidos debe contener al menos 3 caracteres'],
                                        maxlength: [100, '* los apellidos no puede superar los 100 caracteres']
                                    }
                                },

                                {
                                    id: 'login',
                                    value: formData.login,
                                    type: 'text',
                                    name: 'login',
                                    label: 'Nombre user',
                                    validators: {
                                        pattern: ['^(?=.*\\d)?(?=.*[\u0021-\u002b\u003c-\u0040])?(?=.*[A-Z])?(?=.*[a-z])\\S{3,}$', '* formato de login incorrecto, al menos 3 letras MINS'],
                                        minlength: [3, '* el login debe contener al menos 3 caracteres'],
                                    }
                                },

                                {
                                    id: 'telefono',
                                    value: formData.telefono,
                                    type: 'text',
                                    name: 'telefono',
                                    label: 'Teléfono',
                                    validators: {
                                        pattern: ['/^[6]\d{8}$/', '* formato de telefono incorrecto: 666666666']
                                    }
                                }
                            ].map((el, index) => <FormField
                                key={index}
                                id={el.id}
                                value={el.value}
                                type={el.type}
                                name={el.name}
                                label={el.label}
                                validators={el.validators}
                                onChangeInParent={HandlerChangeEventsInChildren}></FormField>)

                        }

                        <p><small className="text-mutted">Agapea S.A se compromete a garantizar la seguridad de tus datos y a guardarlos en la más estricta confidencialidad.</small></p>
                        <hr></hr>

                        <div className="col-12">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkInfo"></input>
                                <label className="form-check-label" htmlFor="checkInfo">
                                    Deseo recibir información sobre libros, novedades y eventos de Agapea.com o sus librerías.
                                </label>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkCondiciones" name="condUso" value="true"></input>
                                <label className="form-check-label" htmlFor="checkCondiciones">
                                    Acepto las condiciones de uso y nuestra politica de cookies.
                                </label>
                            </div>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary btn-lg mt-3">REGISTRAME</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )

    //FUNCION PARA HACER GO-UPSTATE EN COMPONENTS HIJOS 
    //(modificar el state formData desde componentes FormField)
    // --> tiene que pasar como args el name y el value del input
    function HandlerChangeEventsInChildren(name, value) {
        setFormData({
            ...formData,
            [name]: value
        })
    }
}

export default RegisterForm;