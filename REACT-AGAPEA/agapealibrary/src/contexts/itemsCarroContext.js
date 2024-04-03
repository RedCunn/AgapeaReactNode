import { createContext, useContext, useReducer } from "react";

const ItemsCarroContext = createContext();

//funcion reducer:
//en state esta itemsCarro: [{libroElemento: {...}, cantidadElemento:...},{libroElemento: {...}, cantidadElemento:...}...]
    //en el obj action.payload={libroElemento: {...}, cantidadElemento:...}
    
const itemsCarroReducer = (state, action) => {
    
    let _libroOperar = action.payload.libroElemento;
    
    switch (action.type) {
        case 'ADD_NEW_ITEM':
            //comprobamos si el libro a añadir ya existe en la lista
            let _existingitem = state.findIndex(item=> item.libroElemento.ISBN13 === _libroOperar.ISBN13);

            if(_existingitem !== -1){
                return state.map(item=> item.libroElemento.ISBN13 === _libroOperar.ISBN13 ? 
                                        {...item, cantidadElemento: item.cantidadElemento +1} : item);
            }else{
                return [...state, {libroElemento : _libroOperar, cantidadElemento: 1}]
            }
        case 'ADD_UNIT':
            return state.map(item=> item.libroElemento.ISBN13 === _libroOperar.ISBN13 ? 
                                    {...item, cantidadElemento: item.cantidadElemento +1} : item );
        case 'SUBS_UNIT':
            return state.map(item=>{
                                        if(item.libroElemento.ISBN13 === _libroOperar.ISBN13){
                                            //sobre item encontrado resto unidad siempre y cuando sea > 0 , sino devuelvo null y luego filtro el array con Boolean 
                                            let _newQuantity = item.cantidadElemento - 1;
                                            return _newQuantity > 0 ? {...item, cantidadElemento : _newQuantity} : null;
                                        }else{
                                            return item;
                                        }   

                                   }).filter(Boolean);
        case 'REMOVE_ITEM':
            return state.filter(item=> item.libroElemento.ISBN13 !== _libroOperar.ISBN13);
        default:
            return state;
    }
}

//a EXPORTAR: componente q define proveedor del contexto creado, pasando valores globales: itemsCarro y funcion dispatch del reducer 
function ItemsCarroProvider({ children }) {

    const [itemsCarro, dispatch] = useReducer(itemsCarroReducer, []);

    return (
        <ItemsCarroContext.Provider value={{ itemsCarro, dispatch }}>
            {children}
        </ItemsCarroContext.Provider>
    );
}


//a EXPORTAR: hook pers. para usar los valores del contexto creado
function useItemsCarroContext() {
    const _itemsCarroContext = useContext(ItemsCarroContext);
    return _itemsCarroContext;
}

export {ItemsCarroProvider, useItemsCarroContext};