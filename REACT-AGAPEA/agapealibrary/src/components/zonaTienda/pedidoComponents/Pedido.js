import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useCartItemsContext } from '../../../App';
import ElementoPedido from './ElementoPedido';

function Pedido() {

    //#region ----STATE DEL COMPONENTE-----------------------------------------------------------------

    //--- recuperacion del global-state items del pedido
    let { cartItems } = useCartItemsContext();

    //-------- state-local del componente pedido --> variables => subtotal, gastos de envio y total 
    // debe recalcularse cada vez q cambia itemsPedido --- necesito efecto
    let [subTotalPedido, setSubTotalPedido] = useState(0);
    let [gastosEnvio] = useState(2);

    //#endregion

    //#region ----- EFECTOS DEL COMPONENTE QUE AFECTAN AL STATE----------------------------------------
    //se va a ejecutar cada vez que cambie una de las variables de cartItems
    useEffect(
        () => {
            let _subtotal = cartItems.reduce((acum, elem) => acum + (elem.libroElemento.Precio * elem.cantidadElemento), 0);
            setSubTotalPedido(_subtotal);
        },
        [cartItems]
    );
    //#endregion

    //#region ---- FUNCIONES HANDLER DE EVENTS----------------------------------------------------------
    function HandlerSubmitCompra(ev) {
        //:... envio de datos a node
    };
    //#endregion


    return (
        <div className='container'>
            <div className='row'>
                {/** col para dir de envio, facturacion, metodo de pago */}
                <div className='col-8'>

                </div>
                {/** col para el carrito */}
                <div className='col-4'>
                    <div className='container p-0'>
                        <div className='row'><h5><strong>Resumen de la cesta</strong></h5></div>
                        <hr></hr>
                        {
                            cartItems.length === 0 ? (<p>...no hay artículos en el carro de momento...</p>) :
                                (
                                    <>
                                        {
                                            cartItems.map(
                                                elemento => <ElementoPedido item={elemento} key={elemento.libroElemento.ISBN13}></ElementoPedido>
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
                                <Link to="/Tienda/Libros" className="btn btn-outline-primary pt-3 d-flex flex-row">
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

export default Pedido;