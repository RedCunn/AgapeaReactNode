// recibe del contexto global los items del pedido <--- daddy Pedido.js 
import { useCartItemsContext } from '../../../App';// <-- del hook de acceso al contexto global del proveedor cartItemsProvider recibo la funcion setter


function ElementoPedido({ item }) {

    let {cartItems, setCartItems } = useCartItemsContext();
    let { libroElemento, cantidadElemento } = item;

    function ButtonClickHandler(ev) {

        //botonera sumar, restar, eliminar
        //en el ev.target va el button que ha provocado el ev., en su prop name estaria el atrib name del mismo
        let [name, isbn13] = ev.target.name.split('-');
        
        switch (name) {
            case 'buttEliminar': //para no mutar el array cartItems, .filter sobre el mismo y me quedo con todos los items que no son ese
                setCartItems(cartItems.filter((item) => item.libroElemento.ISBN13 !== isbn13));
                break;
            case 'buttSumar': //para no mutar, clonarlo y modificar posicion del array donde este el isbn del libro e incrementar cantidad
                //esto funcionaria...
                
                // let _newItems = cartItems.slice();
                // let _position = _newItems.findIndex(item => item.libroElemento.ISBN13 === isbn13);
                // _newItems[_position].cantidadElemento += 1;
                // setCartItems(_newItems);

                //...pero mejor con .map()
                setCartItems(cartItems.map((item)=> item.libroElemento.ISBN13 === isbn13 ? {...item, cantidadElemento: item.cantidadElemento + 1} : item));
                break;
            case 'buttRestar':
                setCartItems(cartItems.map(item=> {
                    if(item.libroElemento.ISBN13 === isbn13){
                        const _refreshedCantidad = item.cantidadElemento - 1;
                        return _refreshedCantidad > 0 ? {...item, cantidadElemento: _refreshedCantidad} : null;
                    }else{
                        return item;
                    }

                }).filter(Boolean)
                );
                
                break;
            default:
                break;
        }
    }

    return (
        <div className="card mb-3" style={{ maxwidth: "540px" }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={libroElemento.ImagenLibroBASE64}
                        className="img-fluid rounded-start"
                        alt="..."
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <div className="d-flex flex-row justify-content-between">
                            <h5 className="card-title">{libroElemento.Titulo}</h5>
                            {/*boton para eliminar libro de elementos pedido*/}
                            <button
                                className="btn btn-light btn-sm"
                                name={'buttEliminar-'+libroElemento.ISBN13}
                                onClick={ButtonClickHandler}
                            >
                                X
                            </button>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            {/*boton +, label cantidad, boton -  el precio del libro y subtotal elemento pedido*/}
                            <button
                                className="btn btn-outline-primary btn-sm"
                                name={'buttRestar-'+libroElemento.ISBN13}
                                onClick={ButtonClickHandler}
                            >
                                -
                            </button>

                            <label>
                                <small>{cantidadElemento}</small>
                            </label>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                name={'buttSumar-'+libroElemento.ISBN13}
                                onClick={ButtonClickHandler}
                            >
                                +
                            </button>

                            <label>
                                <small>x</small>
                                <span style={{ color: "red" }}>
                                    {libroElemento.Precio}€
                                </span>
                            </label>
                            <label style={{ color: "red" }}>
                                {(libroElemento.Precio * cantidadElemento).toFixed(2)}€
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ElementoPedido;