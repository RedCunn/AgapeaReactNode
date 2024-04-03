import { useState, useRef, useEffect } from 'react';
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import ModalDirecciones from './ModalDirecciones';
import MiniDireccion from './MiniDireccion';
import clienteRESTservice from '../../../services/restCliente';

function InicioPanel() {

    //#region ---variables locales---
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    //#endregion --------------------

    let _modalRef = useRef(null);
    let _valorInicialDireccionModal = {
        type: 'crear',
        direccion: {
            _id: '',
            calle: '',
            cp: 0,
            pais: '',
            provincia: { CCOM: '', CPRO: '', PRO: '' },
            municipio: { CUN: '', CPRO: '', CMUM: '', DMUN50: '' },
            esPrincipal: false,
            esFacturacion: false
        }
    };
    let showModal = () => {
        _modalRef.current.showModal();
    };

    //#region --------------- state manejado por el componente (global por context-api o local) ------------------
    let { clienteLogged, dispatch } = useClienteLoggedContext();
    let [datosCuentaCliente, setDatosCuentaCliente] = useState({
          email: clienteLogged.datoscliente.cuenta.email,
          nombre: clienteLogged.datoscliente.nombre,
          apellidos: clienteLogged.datoscliente.apellidos,
          login: clienteLogged.datoscliente.cuenta.login,
          telefono: clienteLogged.datoscliente.telefono,
          genero: clienteLogged.datoscliente.cuenta.genero,
          descripcion: clienteLogged.datoscliente.cuenta.descripcion,
          fecha_nacimiento: clienteLogged.datoscliente.cuenta.fecha_nacimiento,
      });
      
    const [passwordType, setPasswordType] = useState('password');
    let [direccionesCliente, setDireccionesCliente] = useState(clienteLogged.datoscliente.direcciones);

    let [avatarUser, setAvatarUser] = useState(clienteLogged.datoscliente.cuenta.accountPic);
    let [direccionModal, setDireccionModal] = useState(_valorInicialDireccionModal);

    //#endregion

    //#region --------------- efectos del componente -------------------------------------------------------------

    useEffect(
        () => {
            setDireccionesCliente(clienteLogged.datoscliente.direcciones);
        },
        [clienteLogged]
    );

    //#endregion

    //#region --------------- funciones manejadoras de eventos ----------------------------------------------------

    function revealPassword() {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    }

    function InputImagenOnChange(ev) {
        //en ev.target.files <--- FileList o array de objetos de tipo FILE seleccionados, en pos. [0] estaria el fich.imagen a leer
        let _imagen = ev.target.files[0];
        let _lector = new FileReader();

        _lector.addEventListener('load', (evt) => {
            let _contenidoFichSerializado = evt.target.result;
            //habilito boton subir foto...
            document.getElementById('botonUploadImagen').removeAttribute('disabled');
            setAvatarUser(_contenidoFichSerializado);

        });
        _lector.readAsDataURL(_imagen);
    }

    function BotonUploadImagenClickHandler(ev) {

        let mensajeServicioREST = document.getElementById('mensajeServicioREST');

        try {
            const formData = new FormData();
            const idCli = clienteLogged.datoscliente._id;

            formData.append('file', avatarUser);
            formData.append('idcliente', idCli);

            const upload = async () => {
                let _respImgLoad = await clienteRESTservice.UploadProfileImage(formData);
                console.log('subida exitosa....server response: ', _respImgLoad);
                mensajeServicioREST.innerText = 'Imagen subida exitosamente.';
            }

            upload();
        } catch (error) {
            console.log('fallor en la subida...', error);
            mensajeServicioREST.innerText = 'Error al subir la imagen.';
        }
    }

    function handleInputChange(ev) {
        console.log('select name...', ev.target.name);
        let { name, value } = ev.target;

        setDatosCuentaCliente({
            ...datosCuentaCliente,
            [name]: value
        });
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        let mensajeRESTCorrect = document.getElementById('mensajeRESTModCorrect');
        let mensajeRESTWrong = document.getElementById('mensajeRESTModFailed');
        let diaF = document.getElementById('dia').value;
        let mesF = document.getElementById('mes').value;
        let anioF = document.getElementById('anio').value;
        let fecha_nac = new Date(anioF, mesF-1, diaF);
        
        setDatosCuentaCliente((datosCuentaCliente)=>{
            return{

                ...datosCuentaCliente,
                fecha_nacimiento: fecha_nac
            }
          });

        console.log('MODIFICACIONES........>',datosCuentaCliente);

        try {
            let modify = async () => {
                let _respServ = await clienteRESTservice.ModifyAccountData(datosCuentaCliente, clienteLogged.jwt);
                console.log('respuesta del servidor al modificar datos: ', _respServ);
                if( _respServ.codigo === 1){
                    mensajeRESTWrong.style.display = 'block';
                }else{
                    mensajeRESTCorrect.style.display = 'block';
                    dispatch({
                        type: 'CLIENTE_MODIFIED', 
                        payload: datosCuentaCliente
                    });
                }    
            }
            modify();
            
        } catch (error) {
            console.log('no han podido salvarse las modificaciones');
        }
    }

    //#endregion


    return (
        <div className="container">

            <div className="row">
                <div className="col">
                    <h2>Mi perfil</h2>
                    <div className="alert alert-secondary" data-bs-toggle="collapse" data-bs-target="#collapseDatos" aria-expanded="false" aria-controls="collapseDatos">Datos de perfil</div>
                    <div className="collapse" id="collapseDatos" style={{ marginInline: '3%' }}>

                        <div id='mensajeRESTModCorrect' style={{ background: 'lightgreen', border: 'solid 1px green',borderRadius:'5px', display: 'none' }}>
                            <p style={{color:'green'}} className='ms-2 mt-2'>Cambios guardados...</p>
                        </div>
                        <div id='mensajeRESTModFailed' style={{ background: 'pink', border: 'solid 1px red',borderRadius:'5px', display: 'none' }}>
                            <p style={{color:'red'}} className='ms-2 mt-2'>Cambios no admitidos.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row text-muted">Correo electrónico</div>
                                    <div className="row">
                                        <input type="text" id="inputEmail" name='email' className="input-group-text" style={{ width: "90%" }} placeholder={clienteLogged.datoscliente.cuenta.email} disabled />
                                    </div>
                                    <div className="row text-muted">Contraseña</div>
                                    <div className="row">
                                        <input type={passwordType} name='password' id="inputPass" className="input-group-text" style={{ width: "90%", fontStyle: 'italic' }} placeholder='Genera nueva contraseña' maxLength={12} />
                                    </div>
                                    <div className="row text-muted">Nombre</div>
                                    <div className="row">
                                        <input type="text" id="inputNombre" name='nombre' className="input-group-text" style={{ width: "90%" }} placeholder={clienteLogged.datoscliente.nombre} maxLength={30} onChange={handleInputChange} />
                                    </div>

                                </div>

                                <div className="col-sm-6">
                                    <div className="row text-muted">Teléfono</div>
                                    <div className="row">
                                        <input type="text" name='telefono' id="inputTlfn" className="input-group-text" style={{ width: "90%" }} placeholder={clienteLogged.datoscliente.telefono} maxLength={9} onChange={handleInputChange}  />
                                    </div>
                                    <div className="row text-muted">Repetir la contraseña</div>
                                    <div className='d-flex'>
                                        <div className="col-8">
                                            <input type={passwordType} name='reppassword' id="inputPassRep" className="input-group-text" style={{ width: "90%", fontStyle: 'italic' }} placeholder='...repítela' />
                                        </div>
                                        <div className='col'>
                                            <button style={{ border: 'none', background: 'none', marginLeft: '5%' }} onClick={revealPassword}><box-icon name='low-vision'></box-icon></button>
                                        </div>
                                    </div>

                                    <div className="row text-muted">Apellidos</div>
                                    <div className="row">
                                        <input type="text" name='apellidos' id="inputApellidos" className="input-group-text" style={{ width: "90%" }} placeholder={clienteLogged.datoscliente.apellidos} maxLength={30} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row"><span></span></div>
                            <div className="row">
                                <div className="col-sm-4 mt-5">
                                    <div className="text-muted">Foto</div>
                                    <div id="avatarPerfil" className="card" style={{ width: "200px", height: "250px", backgroundColor: "aliceblue" }}>
                                        <input type="file" accept="image/*" id="selectorImagen" style={{ visibility: "hidden" }} onChange={InputImagenOnChange} />
                                        <button style={{ border: 'none', background: 'none' }} onClick={() => document.getElementById('selectorImagen').click()}>
                                            {
                                                avatarUser ?
                                                    (
                                                        <img src={avatarUser} id="imagenUsuario" style={{ height: "250px", width: "200px" }} alt="..." />
                                                    ) :
                                                    (
                                                        <img src='/img/no-photo-available.png' style={{ height: "170px", width: "190px" }} alt="..."></img>
                                                    )
                                            }
                                        </button>
                                    </div>
                                    <button type="button"
                                        className="btn btn-link btn-sm"
                                        id="botonUploadImagen"
                                        disabled onClick={BotonUploadImagenClickHandler}> + Sube una foto</button>
                                    <div id="mensajeServicioREST"></div>
                                </div>
                                <div className="col-sm-8 mt-5">
                                    <div className="row text-muted">Username</div>
                                    <div className='row'>
                                        <input type="text" id="inputUserlogin" name='login' className="input-group-sm" style={{ width: "fit-content" }} placeholder={clienteLogged.datoscliente.cuenta.login} maxLength={12} onChange={handleInputChange}  />
                                    </div>
                                    <div className="row text-muted mt-2">Genero</div>
                                    <div className="row">
                                        <select className="form-select ms-2" id="genero" name='genero' aria-label="Elige genero" style={{ width: "fit-content" }} onChange={handleInputChange} >
                                            <option value="No" defaultValue={datosCuentaCliente.genero}>{datosCuentaCliente.genero}</option>
                                            <option value="Hombre">Hombre</option>
                                            <option value="Mujer">Mujer</option>
                                            <option value="Cyborg">Cyborg</option>
                                            <option value="Motomami">Motomami</option>
                                        </select>
                                    </div>
                                    <div className="row text-muted mt-2">Fecha de nacimiento</div>
                                    <div className="row" name='fecha-nacimiento'>
                                        <div className="col-sm-4">
                                            <select id="dia" className="form-select" >
                                                <option value="-1" defaultValue={true}>Elige día</option>
                                                {
                                                    Array.from({ length: 31 }, (_, i) => (
                                                        <option key={i} value={i + 1}>{i + 1}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4">
                                            <select id="mes" className="form-select">
                                                <option value="-1" defaultValue={true}>Elige mes</option>
                                                {
                                                    Array.from({ length: meses.length }, (_, i) => (
                                                        <option key={i} value={i + 1}>{meses[i]}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4">
                                            <select id="anio" className="form-select">
                                                <option value="-1" defaultValue={true}>Elige año</option>
                                                {
                                                    Array.from({ length: 120 }, (_, i) => (
                                                        <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>

                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row text-muted"><p>Descripcion <small>(máx. 200 caracteres)</small></p></div>
                                    <div className="row">
                                        <textarea style={{ resize: 'none', fontStyle: 'italic' }} id="textArea" name='descripcion' placeholder={clienteLogged.datoscliente.cuenta.descripcion ? clienteLogged.datoscliente.cuenta.descripcion : 'Cuenta algo sobre tí 🐌'} maxLength={200} onChange={handleInputChange} ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-between mt-3 mb-5">
                                        <button style={{ width: 'fit-content' }} type="submit" className="m-10 btn btn-primary">Modificar Datos</button>
                                        <a style={{ marginTop: '3%', color: 'red' }} href="/"> Darme de baja</a>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>

                    <div className="alert alert-secondary" data-bs-toggle="collapse" data-bs-target="#collapseDirecciones" aria-expanded="false" aria-controls="collapseDirecciones">Direcciones</div>
                    <div className="collapse" id="collapseDirecciones">
                        <div>
                            <p> Guarda todas tus direcciones de envío y elige la que usarás por defecto donde llegarán tus pedidos.</p>

                            <p> Estas son las direcciones a las que puedes hacer tus envíos. Las direcciones de envío serán las que elijas mientras que la
                                facturación será la misma en todas las direcciones:
                            </p>
                        </div>
                        <hr />
                        {/*-- listado de direcciones del cliente para borrar/modificar --*/}
                        {
                            direccionesCliente.length > 0 &&
                            direccionesCliente.map((direc, indice) => <MiniDireccion key={indice}
                                direccion={direc}
                                dispatch={dispatch}
                                setDireccionModal={setDireccionModal}
                                showModal={showModal}></MiniDireccion>
                            )
                        }

                        {/*-- Button trigger modal --*/}
                        <button style={{ marginTop: '3%', paddingBottom: '0%', paddingLeft: '1%' }} type="button" className="btn btn-primary d-flex" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={(ev) => {
                            setDireccionModal((_valorInicialDireccionModal) => {
                                return { ..._valorInicialDireccionModal, type: 'crear' };
                            });
                        }}>
                            <box-icon name='location-plus' color='#ffffff' ></box-icon> <p>Nueva Direccion</p>
                        </button>

                        {/* -- Modal --*/}
                        <ModalDirecciones ref={_modalRef} direccionModal={direccionModal} dispatch={dispatch}></ModalDirecciones>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioPanel;