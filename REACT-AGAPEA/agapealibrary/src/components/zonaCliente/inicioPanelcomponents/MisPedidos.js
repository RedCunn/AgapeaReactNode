import { useState, useEffect } from 'react';
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import clienteRESTservice from '../../../services/restCliente';

function MisPedidos() {
    //#region -------- STATES
    let { clienteLogged } = useClienteLoggedContext();
    let [mispedidos, setMisPedidos] = useState([]);
    let [loading, setLoading] = useState(true);
    //#endregion

    //#region --------- EFFECTS

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const pedidosRecup = await clienteRESTservice.RetrieveOrders(clienteLogged.datoscliente.cuenta, clienteLogged.jwt);
                
                let items = [];

                if (pedidosRecup.datoscliente && Array.isArray(pedidosRecup.datoscliente.pedidos)) {
                    // iterate over orders
                    for (const ord of pedidosRecup.datoscliente.pedidos) {
                        // iterate over books
                        let librito = [];
                        for (const pedido of ord.elementosPedido) {
                            const { Titulo, ImagenLibroBASE64, Precio } = pedido.libroElemento;
                            librito.push({Titulo,ImagenLibroBASE64, Precio})
                        }

                        const { fechaPedido, estadoPedido, totalPedido, direccionEnvio } = ord;
                        const direccion = pedidosRecup.datoscliente.direcciones.find((dir) => dir._id === direccionEnvio);
                        if (direccion) {
                            const { calle, cp } = direccion;
                            items.push({
                                fechaPedido,
                                estadoPedido,
                                totalPedido,
                                direccionEnvio,
                                librito,
                                calle,
                                cp
                            });
                        }
                    }
                } else {
                    console.error("La estructura de datos no es la esperada.");
                }
                setMisPedidos(items);
            } catch (error) {
                console.error('Error al recuperar pedidos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
        console.log()
    },[clienteLogged]);
    //#endregion

    //#region -------- EVENT HANDLERS

    function formatFechaPedido(fechaPedido) {
        const fecha = new Date(fechaPedido);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    useEffect(() => {
        changeColorState();
    }, [mispedidos]); // Run the effect whenever mispedidos changes

    function changeColorState() {
        let estadoPedidos = document.querySelectorAll('.estadoPedido');

        estadoPedidos.forEach((estadoPedido) => {
            if (estadoPedido.textContent !== null) {
                console.log('ESTADO PEDIDO VALUE', estadoPedido.textContent);

                switch (estadoPedido.textContent.trim()) {
                    case 'en preparación':
                        estadoPedido.style.color = 'orange';
                        break;
                    case 'enviado':
                        estadoPedido.style.color = 'green';
                        break;
                    case 'en reparto':
                        estadoPedido.style.color = 'red';
                        break;
                    default:
                        break;
                }
            }
        });
    }
    //#endregion

    return (
        <>
            <div className='container mt-5'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    mispedidos.map((pedido, index) => (
                        <div className='card' key={index}>
                            <div className='row'>
                            <p>{formatFechaPedido(pedido.fechaPedido)}</p>
                            <p id='estadoPedido'><strong>{pedido.estadoPedido}</strong></p>
                            <p>{pedido.totalPedido} €</p>
                            </div>
                            {
                                pedido.librito.map((b,i)=>(
                                    <div className='row' key={i}>
                                        <img src={b.ImagenLibroBASE64} style={{width:'100px'}}></img>
                                    <p><strong> {b.Titulo}</strong></p>
                                    </div>
                                ))
                            }
                            <div className='d-flex'>
                                <p>{pedido.calle}</p>
                                <p>{pedido.cp}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default MisPedidos;