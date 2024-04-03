//modulo js para definir el state-global con context-api clienteLogged
//usando un reducer...no el state
import { createContext, useContext, useReducer } from 'react';

const ClienteLoggedContext = createContext();

//funcion reducer para usar en el hook useReducer.
// REQUIREMENTS:
//-> 2 params.::
//              1º) el valor del state que quieres modificar
//              2º) la accion q te mandan desde los componentes ramas: {type: 'nombre_accion_disparada', payload: 'valor_aincluir_enState'}
//
//------> la funcion debe ser PURA !!! 

//en action.payload va a ir un obj, asi cuando login {datoscliente:..., jwt:...} o asi cuando logout{}
const clienteLoggedReducer = (state, action) => {
    switch (action.type) {
        case 'CLIENTE_LOGGED':
            return action.payload;
        case 'CLIENTE_LOGOUT':
            return null;
        case 'CLIENTE_PROFPIC_CHANGE':
            return {
                ...state,
                'datoscliente': {
                    ...state.datoscliente,
                    'cuenta':
                    {
                        ...state.datoscliente.cuenta,
                        'accountPic': action.payload
                    }
                }
            };
        case 'CLIENTE_MODIFIED':
            const keysToUpdate = Object.keys(action.payload);

            const updatedCliente = keysToUpdate.reduce((updatedState, key) => {
                const keyParts = key.split('.');
                const topLevelKey = keyParts[0];
        
                if (keyParts.length === 1) {
                    // Si la propiedad está directamente en datoscliente
                    updatedState.datoscliente[key] = action.payload[key];
                } else if (keyParts.length === 2 && updatedState.datoscliente[topLevelKey]) {
                    // Si la propiedad está dentro de la subpropiedad cuenta
                    updatedState.datoscliente[topLevelKey][keyParts[1]] = action.payload[key];
                } 

                return updatedState;
            }, { ...state });
        
            return updatedCliente;
        //CREAR Y EDITAR LAS DISPARA EL MODALDIRECCIONES
        case 'CLIENTE_DIRECCION_EDITAR':
            return {
                ...state,
                'datoscliente': {
                    ...state.datoscliente,
                    'direcciones': state.datoscliente.direcciones
                        .map(
                            dir => dir._id === action.payload._id ? action.payload : dir
                        )
                }
            };
        case 'CLIENTE_MAKE_REVIEW':
            return{
                ...state,
                'datoscliente':{
                    ...state.datoscliente,
                    'valoraciones':[...state.datoscliente.valoraciones, action.payload]
                }
            }
        case 'CLIENTE_DIRECCION_CREAR':
            return {
                ...state,
                'datoscliente': { ...state.datoscliente, 'direcciones': [...state.datoscliente.direcciones, action.payload] }
            };
        //ELIMINAR LA DISPARA CADA COMPONENTE MINIDIRECCION 
        case 'CLIENTE_DIRECCION_ELIMINAR':
            return {
                ...state,
                'datoscliente': {
                    ...state.datoscliente,
                    'direcciones': state.datoscliente.direcciones
                        .filter(
                            dir => dir._id !== action.payload._id
                        )
                }
            };
        default:
            return state;
    }
}
//a EXPORTAR: componente con codigo JSX q defina el provider del contexto y pase valores del reducer 
function ClienteLoggedProvider({ children }) {

    const [clienteLogged, dispatch] = useReducer(clienteLoggedReducer, null);

    return (
        <ClienteLoggedContext.Provider value={{ clienteLogged, dispatch }}>
            {children}
        </ClienteLoggedContext.Provider>
    );
}

//a EXPORTAR: hook personalizado para usar los valores del contexto creado
function useClienteLoggedContext() {
    const _clienteLoggedProvider = useContext(ClienteLoggedContext);
    return _clienteLoggedProvider;
}


export { ClienteLoggedProvider, useClienteLoggedContext };