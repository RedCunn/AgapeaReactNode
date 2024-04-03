import { useState, useRef, forwardRef, useImperativeHandle, useEffect, useMemo } from "react";
import restGeoAPi from "../../../services/restGeoApi";

const ModalDirecciones = forwardRef(

    function ModalDirecciones({ direccionModal, dispatch }, ref) {


        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        let [listaProvincias, setListaProvincias] = useState([]);
        let [listaMunicipios, setListaMunicipios] = useState([]);

        //#endregion


        let _divModal = useRef(null);
        let _selectProvRef = useRef(null);
        let _selectMuniRef = useRef(null);

        // useMemo(
        //     async ()=>{
        //             let _provs=await restGeoApi.obtenerProvincias();
        //             //setListaProvincias(_provs);
        //             console.log('provincias obtenidas por useMemo',_provs);
        //             setListaProvincias(_provs);
        //         } ,
        //     []
        // );

        console.log('valor de la prop direccionModal q recibe de InicioPanel ----', direccionModal); //<-- {type: 'crear o editar', direccion:{.....}}

        //-------- valores expuestos al comp.root atraves de la ref. redirigida a obj return del hook: useImperativeHandle
        useImperativeHandle(
            ref,
            () => {
                return {
                    showModal: function () {
                        window.bootstrap.Modal.getOrCreateInstance(_divModal.current).show()
                    },
                    hideModal: function () {
                        window.bootstrap.Modal.getOrCreateInstance(_divModal.current).hide()
                    },
                    modalBootstrapObject: _divModal.current //expongo una ref. a todo el modal, ademas de esos dos metodos
                }
            }

        );

        //#region --------------- efectos del componente -------------------------------------------------------------
        //---> cargar provincias async  (tienes que definirla dentro de la fcallback del useEffect)
        // useEffect(
        //     ()=>{
        //         async function ObtenerProvincias(){
        //             let _provs = await restGeoAPi.obtenerProvincias();
        //             setListaProvincias(_provs);
        //         }

        //         ObtenerProvincias();
        //     }, 
        //     []
        // );

        //***efecto para preseleccionar los datos de provincia y municipio cuando cambia prop.direccionModal
        //q recibe el componente y el tipo de operacion q quiero hacer es 'editar'
        useEffect(
            () => {
                if (direccionModal.type === 'editar') {
                    //selecciono opcion en select provincia con la provincia de la direccion a editar
                    _selectProvRef.current.value = direccionModal.direccion.provincia.CPRO + '-' + direccionModal.direccion.provincia.PRO;
                    _selectProvRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
            [direccionModal]
        );

        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        async function handleSelectChange(ev) {
            console.log('select name...', ev.target.name);
            let { name, value } = ev.target;

            if (name === 'selectProv') {
                let _munis = await restGeoAPi.obtenerMunicipios(value.split('-')[0]);
                setListaMunicipios(_munis);

                //si estoy editando direccion, preselecciono en select inputMunicipio el municipio de la direccion a editar 
                //...dejando un timeout para q de tiempo a cargarse los municipio
                if (direccionModal.type === 'editar') {
                    setTimeout(() => {
                        _selectMuniRef.current.value = direccionModal.direccion.municipio.CPRO + '-' + direccionModal.direccion.municipio.CMUM + '-' + direccionModal.direccion.municipio.DMUN50
                    }, 3000)
                }
            } else {

            }

        }

        function SubmitFormHandler(ev) {
            //lo suyo seria mapear los campos del formulario con una variable en el state interna al componente...puedes validar, etc. 
            //lo hago a lo bestia, recojo los campos del form en un FormData y me creo un obj direccion a partir de ese FormData
            ev.preventDefault();

            //dispatch ({type:'...', payload:...})
            let _payloadDireccion = { esPrincipal: false, esFacturacion: false };
            let _formdata = new FormData(ev.target);//<--- crea un array [[clave,valor],[clave,valor]]

            for (const [name, value] of _formdata.entries()) {

                switch (name) {
                    case 'selectProv':
                        _payloadDireccion['provincia'] = { CCOM: '', CPRO: value.split('-')[0], PRO: value.split('-')[1] }
                        break;
                    case 'selectMuni':
                        _payloadDireccion['municipio'] = { CUN: '', CPRO: value.split('-')[0], CMUM: value.split('-')[1], DMUN50: value.split('-')[2] }
                        break;
                    case 'cp':
                        _payloadDireccion['cp'] = parseInt(value);
                        break;
                    default:
                        _payloadDireccion[name] = value;
                        break;
                }

                console.log('valor del objeto direccion a mandar al contexto con dispatch....', _payloadDireccion);
                dispatch({ type: `CLIENTE_DIRECCION_${direccionModal.type.toUpperCase()}`, payload: _payloadDireccion });
            }

        }
        //#endregion


        return (
            <div ref={_divModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content" style={{ paddingRight: '8%' }}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{direccionModal.type === 'crear' ? 'Nueva Direccion' : 'Modificar Direccion'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <p>Si desea que enviemos el pedido a una dirección distinta de la de facturación, modifique los campos a </p>
                                    <p>continuación según proceda.</p>
                                </div>
                                <div className="row">
                                    <form onSubmit={SubmitFormHandler}>
                                        <div className="col-12">
                                            <label htmlFor="inputCalle" className="form-label">Direccion de Envio:</label>
                                            <input type="text" name="calle" className="form-control" id="inputCalle" placeholder={direccionModal.type === 'crear' ? 'Mi Direccion' : direccionModal.direccion.calle} />
                                        </div>

                                        <div className="d-flex mt-2 justify-content-between">
                                            <div className="col-5">
                                                <label htmlFor="inputCP" className="form-label">Codigo Postal:</label>
                                                <input type="text" name="cp" className="form-control" id="inputCP" placeholder={direccionModal.type === 'crear' ? 'p.e. 28806' : direccionModal.direccion.cp}/>
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor="inputPais" className="form-label">Pais:</label>
                                                <input type="text" name="pais" className="form-control" id="inputPais" placeholder={direccionModal.type === 'crear' ? 'España' : direccionModal.direccion.pais} />
                                            </div>
                                        </div>


                                        <div className="d-flex mt-2 justify-content-between">
                                            <div className="col-6">
                                                <label htmlFor="inputProvincia" className="form-label">Provincia:</label>
                                                <select id="inputProvincia" ref={_selectProvRef} className="form-select" onChange={handleSelectChange} name="selectProv" >
                                                    <option value="0" defaultValue={true}> -Seleccionar Provincia- </option>
                                                    {
                                                        listaProvincias.length > 0 &&
                                                        listaProvincias.map(prov => <option key={prov.CPRO} value={prov.CPRO + "-" + prov.PRO}>{prov.PRO}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="inputMunicipio" className="form-label">Municipio:</label>
                                                <select id="inputMunicipio" ref={_selectMuniRef} className="form-select ms-1" onChange={handleSelectChange} name="selectMuni">
                                                    <option value="0" defaultValue={true}> -Selecciona un Municipio- </option>
                                                    {
                                                        listaMunicipios.length > 0 &&
                                                        listaMunicipios.map((mun, i) => <option key={i} value={`${mun.CPRO}-${mun.CMUM}-${mun.DMUN50}`}>{mun.DMUN50}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <hr style={{ marginTop: '5%' }} />
                                        <div className="d-flex justify-content-between">
                                            <button type="submit" className="btn btn-primary" id="btnCrearDireccion">{direccionModal.type === 'crear' ? 'Añadir Direccion' : 'Modificar Direccion'}</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
)

export default ModalDirecciones;