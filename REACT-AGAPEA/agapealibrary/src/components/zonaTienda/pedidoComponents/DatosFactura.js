import { useState } from 'react';

function DatosFactura({ datosFactura, setDatosFactura }) {
    //#region -------- STATES
    let [empresa, setEmpresa] = useState(true);
    let [otraDirecFact, setOtraDirecFact] = useState(false);
    //#endregion

    //#region --------- EFFECTS
    //#endregion

    //#region -------- EVENT HANDLERS
    function handleRadiosChange(ev) {
        let { name, value } = ev.target;
        console.log('valor de ev.target, name y value...', ev.target, name, value);

        if (name === 'tipofactura') {

            switch (value) {
                case 'facturaempresa':
                    setEmpresa(true);
                    break;
                case 'facturaparticular':
                    setEmpresa(false);
                    break;
                default:
                    break;
            }

        }

        if (name === 'checkdireccionfactura') {
            if (otraDirecFact === false) {
                setOtraDirecFact(true);
            }

            if (otraDirecFact === true) {
                setOtraDirecFact(false);

            }
        }
    }

    function handleInputsChange(ev) {
        let { name, value } = ev.target;

        setDatosFactura({
            ...datosFactura,
            [name]: value
        });

    }

    //#endregion

    return (
        <>

            <div className="col-12 mt-4 d-flex flex-row">
                <div className="col-1"><box-icon name='paperclip' color='#f13939' size='md'></box-icon></div>
                <div className="col-11"><h4>2.- Datos para su factura</h4></div>
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="tipofactura" id="datosfacturaempresa" value="facturaempresa" defaultChecked onChange={handleRadiosChange} />
                        <label className="form-check-label" htmlFor="datosfacturaempresa">
                            Empresa
                        </label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="tipofactura" id="datosfacturaparticular" value="facturaparticular" onChange={handleRadiosChange} />
                        <label className="form-check-label" htmlFor="datosfacturaparticular">
                            Profesional, particular o autónomo
                        </label>
                    </div>
                </div>
            </div>

            {
                empresa ? (

                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="nombreFactura" className="form-label small">Nombre de la empresa</label>
                            <input type="text" className="form-control" id="nombreFactura" name="nombreFactura" onChange={handleInputsChange} />
                        </div>
                        <div className="col-6">
                            <label htmlFor="docFactura" className="form-label small">CIF</label>
                            <input type="text" className="form-control" id="docFactura" name="docFactura" onChange={handleInputsChange} />
                        </div>
                    </div>
                ) :
                    (
                        <div className='row'>

                            <div className="col-6">
                                <label htmlFor="inputNombreCompleto" className="form-label small">Nombre y Apellidos</label>
                                <input type="text"
                                    className="form-control custom-bg-gray"
                                    id="inputNombreCompleto"
                                    name="nombreCompletoFactura"
                                    onChange={handleInputsChange} />
                            </div>
                            <div className="col-6">
                                <label htmlFor="inputDNI" className="form-label small">DNI</label>
                                <input type="text"
                                    className="form-control custom-bg-gray"
                                    id="inputDNI"
                                    name="DNIFactura"
                                    onChange={handleInputsChange} />
                            </div>
                        </div>
                    )

            }
            <div className="row">
                <div className="col">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="checkdireccionfactura" name='checkdireccionfactura' defaultChecked onChange={handleRadiosChange} />
                        <label className="form-check-label" htmlFor="checkdireccionfactura">
                            Direccion de facturacion igual que la de envio
                        </label>
                    </div>
                </div>
            </div>

            {
                otraDirecFact && (
                    <div className="row mt-2" id="filadireccionfacturacioncontainer">
                        <div className="container" id="direccionfacturacioncontainer">
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="inputPaisFactura" className="form-label">Pais</label>
                                    <input type="text" className="form-control" id="inputPaisFactura" placeholder="España" name="paisfacturacion" onChange={handleInputsChange} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="inputProvinciaFactura" className="form-label">Provincia*</label>
                                    <select id="inputProvinciaFactura" className="form-select" name="provinciafactura" onChange={handleInputsChange}>
                                        <option value="-1" selected> - Seleccionar Provincia - </option>
                                    </select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-6">
                                    <label htmlFor="inputCalleFactura" className="form-label">Direccion completa*</label>
                                    <input type="text" className="form-control" id="inputCalleFactura" placeholder="Mi Direccion" name="callefactura" onChange={handleInputsChange} />
                                </div>

                                <div className="col-2">
                                    <label htmlFor="inputCPFactura" className="form-label">CP*</label>
                                    <input type="text" className="form-control" id="inputCPFactura" placeholder="Codigo Postal: 28803" name="cpfactura" onChange={handleInputsChange} />
                                </div>


                                <div className="col-4">
                                    <label htmlFor="inputMunicipioFactura" className="form-label">Localidad*</label>
                                    <select id="inputMunicipioFactura" className="form-select" name="municipiofactura" disabled onChange={handleInputsChange}>
                                        <option value="-1" selected> - Selecciona un Municipio -</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>


    );
}

export default DatosFactura;