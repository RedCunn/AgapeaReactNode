import {useItemsCarroContext} from '../../../contexts/itemsCarroContext';

function ElementoPedidov2({ item }) {

    let { itemsCarro, dispatch } = useItemsCarroContext();
    let { libroElemento, cantidadElemento } = item;

    function ButtonClickHandler(ev) {

        let [name, isbn13] = ev.target.name.split('-');
        
        let _libroOperar = itemsCarro.filter(item=> item.libroElemento.ISBN13 === isbn13).map(el=> el.libroElemento)[0];//solo me interesa pasarle el libro en si con su isbn al dispatcher, por eso filtro y me quedo solo con el libro haciendo un map (aunque sea un array es de una sola posicion) 
        let _action = {type:'',payload:{libroElemento: _libroOperar}}

        switch (name) {
            case 'buttEliminar': 
                _action.type = 'REMOVE_ITEM';
                break;
            case 'buttSumar':
                _action.type = 'ADD_UNIT';
                break;
            case 'buttRestar':
                _action.type = 'SUBS_UNIT';
                break;
            default:
                break;
        }

        dispatch(_action);
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

export default ElementoPedidov2;