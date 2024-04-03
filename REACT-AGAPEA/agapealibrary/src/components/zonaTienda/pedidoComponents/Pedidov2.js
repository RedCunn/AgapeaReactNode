import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItemsCarroContext } from '../../../contexts/itemsCarroContext';
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import ElementoPedidov2 from './ElementoPedidov2';
import DatosEnvio from '../../zonaTienda/pedidoComponents/DatosEnvio';
import DatosFactura from '../../zonaTienda/pedidoComponents/DatosFactura';
import DatosPago from '../../zonaTienda/pedidoComponents/DatosPago';
import pedidoRESTservice from '../../../services/restPedido';

function Pedidov2({ props }) {

    const navigate = useNavigate();
    //#region ----STATE DEL COMPONENTE-----------------------------------------------------------------

    //--- recuperacion del global-state items del pedido
    let { itemsCarro } = useItemsCarroContext();
    let { clienteLogged } = useClienteLoggedContext();
    //-------- state-local del componente pedido --> variables => subtotal, gastos de envio y total 
    // debe recalcularse cada vez q cambia itemsPedido --- necesito efecto

    let [deseoFactura, setDeseoFactura] = useState(false);
    let [datosFactura, setDatosFactura] = useState(
        {
            tipofactura: 'facturaempresa', //puede ser: facturaempresa o facturaparticular
            nombreFactura: '',
            docFactura: '',
            checkdireccionfactura: 'true',
            callefactura: '',
            municipiofactura: '',
            provinciafactura: '',
            paisfactura: '',
            cpfactura: ''
        }
    );

    let [datosPago, setDatosPago] = useState(
        {
            pagoradios: 'pagotarjeta',
            numerocard: '4242424242424242',
            mescard: '',
            aniocard: '',
            cvv: '',
            nombrebancocard: ''
        }
    );

    let [datosEnvio, setDatosEnvio] = useState(
        {
            calle: '',
            municipio: '',
            provincia: '',
            pais: '',
            cp: '',
            nombreEnvio: '',
            apellidosEnvio: '',
            telefonoContacto: '',
            emailEnvio: '',
            otrosDatos: ''
        }
    );

    let [subTotalPedido, setSubTotalPedido] = useState(0);
    let [gastosEnvio, setGastosEnvio] = useState(2);

    //#endregion

    //#region ----- EFECTOS DEL COMPONENTE QUE AFECTAN AL STATE----------------------------------------
    //se va a ejecutar cada vez que cambie una de las variables de itemsCarro
    useEffect(
        () => {
            console.log('itemsCarro:', itemsCarro);
            let _subtotal = itemsCarro.reduce((acum, elem) => acum + (elem.libroElemento.Precio * elem.cantidadElemento), 0);
            setSubTotalPedido(_subtotal);
        },
        [itemsCarro]
    );

    useEffect(
        () => {
            const _dirppal = clienteLogged.datoscliente.direcciones.filter(dir => dir.esPrincipal === true)[0];

            switch (_dirppal.provincia.CPRO) {
                case '07'://Baleares
                    setGastosEnvio(2.5);
                    break;

                case "38":
                case "35"://Canarias
                    setGastosEnvio(3);
                    break;

                case "51":
                case "52"://Ceuta y Melilla
                    setGastosEnvio(3.5);
                    break;

                default: //peninsula
                    setGastosEnvio(2);
                    break;
            }
        },
        [clienteLogged.datoscliente.direcciones]);

    //#endregion

    //#region ---- FUNCIONES HANDLER DE EVENTS----------------------------------------------------------
    async function HandlerSubmitCompra(ev) {
        //:... envio de datos a node
        ev.preventDefault();
        console.log('datos a mandar al servidor node para finalizar pedido...');

        let _resp = await pedidoRESTservice.finalizarPedido(datosEnvio, datosFactura, datosPago, itemsCarro, gastosEnvio, clienteLogged);

        if (_resp.codigo == 0) {
            navigate('/Cliente/Panel/InicioPanel');
        } else {
            //...error al finalizar pago, mirar en _resp.error y mostrarlo en la vista del componente
        }
    };
    //#endregion


    return (
        <div className='container'>
            <div className='row me-3'>
                {/** col para dir de envio, facturacion, metodo de pago */}
                <div className='col-8' style={{ backgroundColor: 'lightskyblue', paddingRight: '5%', borderRadius: '25px' }}>
                    <DatosEnvio datosEnvio={datosEnvio} setDatosEnvio={setDatosEnvio} />

                    <div className="row" id="filafacturacontainer">
                        <div className="col-12 mt-3">
                            <input type="checkbox" id="checkfactura" name='checkfactura' onClick={() => setDeseoFactura(!deseoFactura)} />
                            <label htmlFor="checkfactura">Deseo factura</label>
                        </div>
                        {
                            deseoFactura && (
                                <>
                                    <DatosFactura datosFactura={datosFactura} setDatosFactura={setDatosFactura} />
                                </>
                            )
                        }

                    </div>
                    <DatosPago datosPago={datosPago} setDatosPago={setDatosPago} numeracion={deseoFactura ? 3 : 2} />
                    <div className="col-12 p-2 my-3 d-flex flex-column">
                        <div>
                            <input type="checkbox" />
                            <label>Deseo recibir información sobre libros, novedades y eventos de Agapea.com o sus librerías.</label>
                        </div>
                        <div>
                            <input type="checkbox" />
                            <label>He leído y acepto la política de privacidad y cookies y las condiciones de contratación y devolución</label>
                        </div>
                    </div>

                    <div className="col-12 d-flex justify-content-center mb-5">
                        <button type="submit" className="btn btn-primary pb-0">
                            <div className="d-flex flex-row my-0">
                                <box-icon name='package' type='solid' color='#ffffff' className="me-2"></box-icon>
                                <p>Finalizar pedido</p>
                                <box-icon name='package' type='solid' color='#ffffff' className="ms-2"></box-icon>
                            </div>
                        </button>
                    </div>

                </div>
                {/** col para el carrito */}
                <div className='col-4'>
                    <div className='container p-0'>
                        <div className='row'><h5><strong>Resumen de la cesta</strong></h5></div>
                        <hr></hr>
                        {
                            itemsCarro && itemsCarro.length === 0 ? (<p>...no hay artículos en el carro de momento...</p>) :
                                (
                                    <>
                                        {
                                            itemsCarro.map(
                                                elemento => <ElementoPedidov2 item={elemento} key={elemento.libroElemento.ISBN13}></ElementoPedidov2>
                                            )
                                        }
                                        <div className='row'>
                                            <div className='col-9'>
                                                <p><strong>Subtotal:</strong></p>
                                            </div>
                                            <div className='col-3 d-flex justify-content-end'>
                                                <p><span style={{ color: "red" }}>{subTotalPedido.toFixed(2)} €</span></p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <p><small>Gastos de envio:</small></p>
                                            </div>
                                            <div className='col-3 d-flex justify-content-end'>
                                                <p><span><small>{gastosEnvio} €</small></span></p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <h6><strong>Total:</strong></h6>
                                            </div>
                                            <div className='col-3 d-flex justify-content-end'>
                                                <p><strong>{(subTotalPedido + gastosEnvio).toFixed(2)} €</strong></p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <small>El periodo de entrega es de 1 a 7 días laborables </small>
                                        </div>
                                    </>
                                )
                        }
                        <div className='row d-flex flex-row justify-content-between'>
                            <div className='col-6 mt-2'>
                                <Link to="/Tienda/Librosv2" className="btn btn-outline-primary pt-3 d-flex flex-row">
                                    <box-icon name='backpack' type='solid' color='#3276fb' ></box-icon>
                                    <p className="ms-1">Seguir comprando</p>
                                </Link>
                            </div>
                            <div className='col-6 mt-2'>
                                <button onClick={HandlerSubmitCompra} className='btn btn-primary pt-3 d-flex flex-row'>
                                    <p className='me-4'>Finalizar pedido</p>
                                    <box-icon name='package' color='#ffffff'></box-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Pedidov2;