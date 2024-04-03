var pedidoRESTservice = {
    finalizarPedido: async function(datosEnvio, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged){
        //peticion fetch al servicio de node, devuelve el objeto Response Fetch APi
        try {
            let _respServer = await fetch(
                'http://localhost:3003/api/Pedido/FinalizaPedido',
                {
                    method: 'POST',
                    body: JSON.stringify({datosEnvio, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${clienteLogged.jwt}`
                    }
                }
            )
            if(! _respServer.ok) throw new Error('...error al intentar finalizar pedido wuawuawuaaa');
            return _respServer.json();
        } catch (error) {
            console.log('error al intentar finalizar pedido...', error);
            return{};
        }
    }
}

export default pedidoRESTservice;