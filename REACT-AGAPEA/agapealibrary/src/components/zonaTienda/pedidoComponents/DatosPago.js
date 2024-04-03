import { useState } from 'react';

function DatosPago({ datosPago, setDatosPago, numeracion }) {
    //#region -------- STATES
    let [pagoTarjeta, setPagoTarjeta] = useState(true);
    //#endregion

    //#region --------- EFFECTS
    //#endregion

    //#region -------- EVENT HANDLERS

    function handleInputsChange(ev) {
        let { name, value } = ev.target;
        console.log('valor de ev.target, name y value...', ev.target, name, value);
        if (name === 'pagoradios') {
            value === 'pagotarjeta' ? setPagoTarjeta(true) : setPagoTarjeta(false);
        }

        setDatosPago({ ...datosPago, [name]: value });
    }
    //#endregion

    return (
        <>
            <div className="d-flex flex-row mt-3">
                <box-icon name='credit-card-alt' color='#f13939' size='md'></box-icon>
                <h4 id="txtpago" className="ms-3">{numeracion}. - Pago</h4>
            </div>
            <div className="col-12">
                <input type="checkbox" id="checkCodigoPromo" /> Usar código promocional
            </div>
            <div className="col-12">
                <label>
                    <input type="radio" id="pagotarjeta" name="pagoradios" value="pagotarjeta" onChange={handleInputsChange} defaultChecked /> Pago con tarjeta
                </label>
            </div>
            <div className="col-12">
                <label>
                    <input type="radio" id="pagopaypal" name="pagoradios" value="pagopaypal" onChange={handleInputsChange} /> Pago mediante PayPal
                    <box-icon name='paypal' type='logo' color='#0822f9' size='md'></box-icon>
                </label>
            </div>
            {
                pagoTarjeta && (
                    <div id="containerPago">
                        <div id="containerDatosPagoConTarjeta" className="container p-3 my-2" style={{ backgroundColor: 'lightgreen', borderRadius: '25px' }}>
                            <div className="row">
                                <div className="col-5">
                                    <label htmlFor="inputNumero" className="form-label">Numero de la tarjeta *</label>
                                    <input type="text" id="inputNumero" className="form-control" name="numerocard" />
                                </div>

                                <div className="col-5">
                                    <label className="form-label">Fecha caducidad *</label>
                                    <div className="d-flex flex-row justify-content-start">
                                        <select id="inputAnio" className="form-select" name="aniocard" style={{ width: 'fit-content', height: 'fit-content' }}
                                            onChange={handleInputsChange}>
                                            {
                                                Array.from({ length: 10 }, (_, i) => i + 1).map(
                                                    pos => {
                                                        var anio = (new Date(Date.now()).getFullYear()) + pos;
                                                        return <option value={anio} key={anio}>{anio}</option>
                                                    }
                                                )
                                            }
                                        </select>
                                        <select id="inputMes" className="form-select" name="mescard" style={{ width: 'fit-content', height: 'fit-content' }}
                                            onChange={handleInputsChange}>
                                            {
                                                Array.from({ length: 12 }, (_, i) => i + 1).map(
                                                    pos => <option value={pos} key={pos}>{pos}</option>
                                                )
                                            }
                                        </select>
                                    </div>

                                </div>
                                <div className="col-2">
                                    <label htmlFor="inputCVV" className="form-label">CVV *</label>
                                    <input type="text" className="form-control" id="inputCVV" name="cvv" onChange={handleInputsChange}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label className="form-label">Nombre del Banco de la tarjeta</label>
                                    <input type="text" id="inputNombreBanco" className="form-control" name="nombrebancocard" onChange={handleInputsChange}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-4 d-flex flex-row justify-content-start">
                                    <img src="/img/visa.png" style={{ width: '150px', height: '30px' }} alt=''/>
                                    <p className="mx-2 my-2"><small> Pago Seguro 100% garantizado</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                )
            }
        </>
    );
}

export default DatosPago;