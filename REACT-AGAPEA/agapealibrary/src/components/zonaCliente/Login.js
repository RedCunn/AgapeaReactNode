import { useState } from "react";
import clienteRESTservice from "../../services/restCliente";
import { Link, useNavigate } from "react-router-dom";
import '../../css/login.css';
import { useClienteLoggedContext } from '../../contexts/clienteLoggedContext';


function Login() {
    let [datoslogin, setDatosLogin] = useState({ email: '', password: '' });

    let { dispatch } = useClienteLoggedContext();

    let navigate = useNavigate();

    function HandlerChangeInputs(ev) {

        let { name, value } = ev.target;

        setDatosLogin(
            {
                ...datoslogin,
                [name]: value
            }
        )
    }

    async function HandlerSubmitForm(ev) {
        let wrongCredentials = document.getElementById('wrongCredentials');
        try {
            ev.preventDefault();
            let _respLogin = await clienteRESTservice.LoginCliente(datoslogin);
            console.log('login....server response: ', _respLogin);

            if (_respLogin.datoscliente !== null) {

                dispatch(
                    {
                        type: 'CLIENTE_LOGGED',
                        payload: { datoscliente: _respLogin.datoscliente, jwt: _respLogin.tokensession }
                    }
                );

                navigate('/');
            } else {
                wrongCredentials.style.display = 'block';
            }

        } catch (error) {
            console.log('error en login...', error);
        }

    }
    return (
        <div className="container pt-5">
            <div className="row">
                <div id="wrongCredentials" style={{ color: 'red', marginInlineStart: '58%', border: 'solid 1px red', background: 'pink', paddingBottom: '5px', paddingTop: '10px', display: 'none' }}>
                    <p className="ms-2">Credenciales incorrectas...</p>
                </div>
                <h2 className="mt-5">Registrate en <strong>agapea.com</strong></h2>
                <div className="mt-4">
                    <Link to="/Cliente/register" className="btn btn-dark btn-lg">Registrate</Link>
                </div>
                <div className="col-7 pt-3 d-flex justify-content-center mt-5">
                    <img src="/img/login-agapea.png" alt="" />
                </div>
                <div className="col-5 bg-light p-4 border">
                    <form onSubmit={HandlerSubmitForm}>
                        <h4>Identifícate con: </h4>
                        <div className="logoContainer">
                            <Link to="/Tienda/Librosv2"><img src="/img/logo-agapea.jpg" style={{ width: "200px" }} alt="" /></Link>
                        </div>
                        <div className="form-floating m-1">
                            <input type="email" name="email" className="form-control" id="Email" placeholder="Correo" onChange={HandlerChangeInputs} />
                            <span className="text-danger"></span>
                            <label htmlFor="email"><small>Email</small></label>
                        </div>
                        <div className="form-floating m-1">
                            <input type="password" name="password" className="form-control" id="Password" placeholder="Contraseña" onChange={HandlerChangeInputs} />
                            <span className="text-danger"></span>
                            <label htmlFor="password"><small>Contraseña</small></label>
                        </div>
                        <div className="mt-2 ml-1">
                            <Link to=""><small className="text-mutted">¿Has olvidado tu contraseña?</small></Link>
                        </div>
                        <button className="m-4 btn btn-lg btn-primary" type="submit">Identifícate</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;