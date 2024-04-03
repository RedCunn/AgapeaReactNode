//objeto js que tiene como props funciones para hacer pasos del pago con tarjeta usando stripe
// --> para hacer peticiones REST a Stripe uso axios (puedes usar fetch-api o XMLHttpRequest...)
const axios = require('axios');
const _clientHttp = axios.create(
    {
        baseURL: 'https://api.stripe.com/v1/',
        headers: {
            'Authorization': `Bearer ${process.env.STRIPE_API_KEY}`
        }
    }
);
//OJO QUE LA API DE STRIPE NO ADMITE JSONS ----> DATOS EN FORMATO x-www-urlencoded
//truqui: puedes pasar un json a prototipo URLSearchParam y te lo convierte a ese formato
module.exports = {
    createCustomer: async (datosclientelogged) => {
        try {
            let _dirppal=datosclientelogged.direcciones.filter(direc=> direc.esPrincipal===true)[0];
            let _customerStripeValues=new URLSearchParams(            
                                                            {
                                                                'name': datosclientelogged.nombre,
                                                                'email': datosclientelogged.cuenta.email,
                                                                'phone': datosclientelogged.telefono,
                                                                'address[city]': _dirppal.municipio.DMUN50,
                                                                'address[state]': _dirppal.provincia.PRO,
                                                                'address[country]': _dirppal.pais,
                                                                'address[postal_code]': _dirppal.cp.toString(),
                                                                'address[line1]': _dirppal.calle                
                                                            }
                                            ).toString();

           let _respuesta=await _clientHttp.post('customers', _customerStripeValues);
           console.log(_respuesta.data);
           if (_respuesta.status===200) {
                console.log('respuesta de stripe cuando creamos CUSTOMER...', _respuesta.data);
                return _respuesta.data.id;
           } else {
             return null;
           }
        } catch (error) {
            console.log('error al intentar crear CUSTOMER de STRIPE...', error);
            console.error(error._respuesta.data);
            return null;
        }

    },
    createCardFromCustomer: async (stripeClientId) => {
        try {

            let _stripeCardValues = new URLSearchParams({ 'source': 'tok_visa' }).toString();

            let _response = await _clienteHttp.post(`customers/${stripeClientId}/sources`, _stripeCardValues);

            if (_response.status === 200) {
                console.log('respuesta de stripe cuando creamos CARD...', _response.data);
                return _response.data.id;
            } else {
                return null;
            }

        } catch (error) {
            console.log('error al intentar crear CARD asociado al CUSTOMER de STRIPE...', error);
            return null;

        }

    },
    createCharge: async (stripeClientId, cardId, totalOrder, idOrder) => {
        try {
            let _bodyrequest = new URLSearchParams(
                {
                    'customer': stripeClientId,
                    'source': cardId,
                    'currency': 'eur',
                    'amount': (totalOrder * 100).toString(),
                    'description': idOrder
                }
            ).toString();

            let _response = await _clienteHttp.post(`charges`, _bodyrequest);

            if (_response.status === 200) {
                console.log('respueta de stripe cuando creamos CARD asociada al customer...', _response);
                return _response.data.status === 'succeeded';
            } else {
                return null;
            }

        } catch (error) {
            console.log('error al intentar crear con stripe un objeto CHARGE (pago) asociado al card del customer....', error);
            return null;
        }
    }
}