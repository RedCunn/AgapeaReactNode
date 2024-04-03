import { useState } from 'react';
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';

function DatosEnvio({ datosEnvio, setDatosEnvio }) {

    let { clienteLogged } = useClienteLoggedContext();

    //------------------------------------ state del comp.----------------------
    let [otraDireccion, setOtraDireccion] = useState(false);
    let [datosEnvioClienteLogged, setDatosEnvioClienteLogged] = useState(true);
    let [otrosDatosEnvio, setOtrosDatosEnvio] = useState(false);

    let _dirppal = clienteLogged.datoscliente.direcciones.filter(direc => direc.esPrincipal === true)[0];

    //-------------------- funciones manejadoras de eventos -------------------------------------
    function HandlerChangeRadios(ev) {
        let { name, value } = ev.target;
        console.log('valor de ev.target, name y value...', ev.target, name, value);

        if (name === 'direccionradios') {
            switch (value) {
                case '_dirppal':
                    setOtraDireccion(false);
                    setDatosEnvio(
                        {
                            ...datosEnvio,
                            calle: _dirppal.calle,
                            cp: _dirppal.cp,
                            pais: _dirppal.pais,
                            provincia: _dirppal.provincia,
                            municipio: _dirppal.municipio
                        }
                    )
                    break;

                case 'otradireccion':
                    setOtraDireccion(true);
                    break;

                default:
                    break;
            }

        }

        if (name === 'personaenvioradios') {
            switch (value) {
                case 'clienteloggedenvio':
                    setOtrosDatosEnvio(!otrosDatosEnvio);
                    setDatosEnvioClienteLogged(true);
                    setDatosEnvio(
                        {
                            ...datosEnvio,
                            nombreEnvio: clienteLogged.datoscliente.nombre,
                            apellidosEnvio: clienteLogged.datoscliente.apellidos,
                            telefonoContacto: clienteLogged.datoscliente.telefono,
                            emailEnvio: clienteLogged.datoscliente.cuenta.email
                        }
                    );
                    break;

                case 'otrapersonaenvio':
                    setDatosEnvioClienteLogged(!datosEnvioClienteLogged);
                    setOtrosDatosEnvio(true);
                    setDatosEnvio(
                        {
                            ...datosEnvio,
                            nombreEnvio: '',
                            apellidosEnvio: '',
                            telefonoContacto: '',
                            emailEnvio: ''
                        }
                    );
                    break;
                default:
                    break;
            }
        }


    }

    // change en inputs ....
    function HandlerChangeInputs(ev) {
        let { name, value } = ev.target;
        setDatosEnvio(
            {
                ...datosEnvio,
                [name]: value
            }
        );
    }

    return (
        <>
            <div className="row g-3 mt-3 me-4">
                <div className="d-flex flex-row mt-3">
                    <box-icon name='notepad' color='#f13939' size='md'></box-icon>
                    <h4 className="ms-3">1. - Datos de entrega</h4>
                </div>

                <div className="col-12">
                    {
                        clienteLogged !== null ?
                            (
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="direccionradios"
                                        id="_dirppal"
                                        value="_dirppal"
                                        defaultChecked
                                        onChange={HandlerChangeRadios}
                                    />
                                    <label className="form-check-label" htmlFor="_dirppal">
                                        {_dirppal.calle}. {_dirppal.municipio.DMUN50}, {_dirppal.provincia.PRO} CP: {_dirppal.cp}. {_dirppal.pais}
                                    </label>
                                </div>
                            ) :
                            (
                                <>
                                    <div className='col-12'>
                                        <p>No nos has dado tu dirección todavía.</p>
                                    </div>
                                </>
                            )
                    }
                </div>
                <div className='col-12'>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="direccionradios" id="direccionagapea" disabled />
                        <label className="form-check-label" htmlFor="direccionagapea">
                            Recoger en libreria Agapea (No disponible en este momento. Envíos a domicilio.)
                        </label>
                    </div>
                </div>
                <div className="col-12">
                    <label>
                        <input type="radio" id="inputEnvioDomicilio" name="opcionEnvio" value="domicilio" defaultChecked /> Envío a domicilio 🏠
                    </label>
                </div>

                <div className="col-12">
                    <input className="form-check-input" type="radio" name="direccionradios" id="direccionotra" value="otradireccion" onChange={HandlerChangeRadios} />
                    <label className="form-check-label" htmlFor="direccionotra">Recibir en otra direccion</label>
                </div>
                {otraDireccion && (
                    <div id="filadireccioncontainer">
                        <div id="direccioncontainer" className="container">
                            <div className="row my-2">
                                <div className="col-6">
                                    <label htmlFor="selectPais" className="form-label small">País *</label>
                                    <select className="form-control custom-bg-gray"
                                        id="selectPais"
                                        name="pais">
                                        <option value="-1" selected>- Seleccionar país -</option>
                                        <option value="1-España">España</option>
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="inputProvincia" className="form-label small">Provincia *</label>
                                    <select className="form-control custom-bg-gray"
                                        id="inputProvincia"
                                        name="provincia">
                                        <option value="-1" selected>- Seleccionar provincia -</option>

                                    </select>
                                </div>
                            </div>
                            <div className="row my-2">
                                <div className="col">
                                    <label htmlFor="inputCalle" className="form-label small"> Direccion completa *</label>
                                    <input type="text" className="form-control" id="inputCalle" placeholder="Mi Direccion" name="calle" />
                                </div>
                                <div className="col-md-auto">
                                    <label htmlFor="inputCP" className="form-label small">Codigo Postal *</label>
                                    <input type="text" className="form-control" id="inputCP" placeholder="Codigo Postal: 28803" name="cp" />
                                </div>
                                <div className="col-4">
                                    <label htmlFor="inputMunicipio" className="form-label small">Municipio *</label>
                                    <select id="inputMunicipio" className="form-select" name="municipio" disabled>
                                        <option value="-1" selected> - Selecciona un Municipio -</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )

                }
                <div className="col-12">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="personaenvioradios" id="clienteloggedenvio" value="clienteloggedenvio" onChange={HandlerChangeRadios} defaultChecked />
                        <label className="form-check-label" htmlFor="clienteloggedenvio">Datos de usuario registrado</label>
                        <p><small>{clienteLogged.datoscliente.cuenta.email} ( {clienteLogged.datoscliente.cuenta.login} )</small></p>
                    </div>
                </div>
                {
                    datosEnvioClienteLogged &&
                    (
                        <div id="filacontainerdatospersonaenvio">

                            <div id="containerdatosclientelogged" className="container">
                                <div className="col-6">
                                    <label htmlFor="telefonoContacto" className="form-label small">Teléfono de contacto *</label>
                                    <input type="text"
                                        className="form-control custom-bg-gray"
                                        id="telefonoContacto"
                                        placeholder={clienteLogged.datoscliente.telefono} name="telefonoContacto" />
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className='col-12'>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="personaenvioradios" id="otrapersonaenvio" value="otrapersonaenvio" onChange={HandlerChangeRadios} />
                        <label className="form-check-label" htmlFor="otrapersonaenvio">
                            Usar otros datos
                        </label>
                    </div>
                </div>

                {
                    otrosDatosEnvio && (
                        <div id="containerotrosdatoscliente" className="container">
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="inputNombre" className="form-label small">Nombre *</label>
                                    <input type="text"
                                        className="form-control custom-bg-gray"
                                        id="inputNombre"
                                        name="nombreEnvio"
                                        onChange={HandlerChangeInputs} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="inputApellidos" className="form-label small">Apellidos *</label>
                                    <input type="text"
                                        className="form-control custom-bg-gray"
                                        id="inputApellidos"
                                        name="apellidosEnvio"
                                        onChange={HandlerChangeInputs} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="inputCorreo" className="form-label small">Correo electrónico *</label>
                                    <input type="text"
                                        className="form-control custom-bg-gray"
                                        id="inputCorreo"
                                        name="emailEnvio"
                                        onChange={HandlerChangeInputs} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="telefonoContacto" className="form-label small">Teléfono de contacto *</label>
                                    <input type="text"
                                        className="form-control custom-bg-gray"
                                        id="telefonoContactoNuevo"
                                        name="telefonoContacto"
                                        onChange={HandlerChangeInputs} />
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className='col-12'>
                    <label htmlFor="otrosDatos" className="form-label small">Otros datos de entrega <small>(Máx. 50 caracteres)</small></label>
                    <input type="text" className="form-control" id="otrosDatos" name="otrosdatos" onChange={HandlerChangeInputs} />
                </div>
            </div >


        </>
    );
}

export default DatosEnvio;