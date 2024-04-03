import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useCartItemsContext } from '../../../App';

function Libros() {

    let { cartItems, setCartItems } = useCartItemsContext();
    let _listaLibros = useLoaderData();
    const navigate = useNavigate();

    function AddLibroToPedido(ev) {
        let _isbn13 = ev.target.id.split('-')[1];
        console.log('id del libro que quieres añadir: ', _isbn13);
        console.log('items del carro...', cartItems);

        //ESTO ESTA MAL !!! no se puede modificar el objeto del state directamente, esto supondria mutar el state y hace q la funcion del componente sea IMPURA
        /**
         *let _libroToAdd = _listaLibros.find(libro=> libro.ISBN13 === _isbn13);
        cartItems.push({libroElemento: _libroToAdd, cantidadElemento : 1});
        setCartItems(cartItems); 
         */

        // ¿como añado el objeto sin mutarlo? --->>> clonando el array original con find y añadiendo nuevo elemento se lo pasas a la funcion setItemsCarro
        const existingCartItem = cartItems.find(item => item.libroElemento.ISBN13 === _isbn13);

        if (existingCartItem) {
            const updatedCartItems = cartItems.map(item => {
                if (item.libroElemento.ISBN13 === _isbn13) {
                    return { ...item, cantidadElemento: item.cantidadElemento + 1 };
                }
                return item;
            });
            setCartItems(updatedCartItems);
        } else {
            const libroToAdd = _listaLibros.find(libro => libro.ISBN13 === _isbn13);
            const newCartItem = { libroElemento: libroToAdd, cantidadElemento: 1 };
            setCartItems([...cartItems, newCartItem]);
        }

        navigate('/Tienda/pedido');

    }

    return (
        <>
            <div className="ms-5 mt-4 container">
                <div className="row">
                    {_listaLibros.map((item) => (
                        <div className="col-4" key={item.ISBN13}>
                            <div className="mb-3" style={{ maxWidth: "540px" }} id={`cardLibro-${item.ISBN13}`}>
                                <div className="row g-0">
                                    <div className="col-4" style={{ width: "200px", height: "260px", marginBottom: "3%" }}>
                                        <div style={{ height: "330px" }}>
                                            <Link to={"/Tienda/MostrarLibro/" + item.ISBN13}>
                                                <img style={{ width: "100%" }} className="img-fluid rounded-start rounded-end" src={item.ImagenLibroBASE64} alt="" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="ms-3">
                                            <div className="container d-flex flex-column justify-content-center" style={{ textAlign: "center" }}>
                                                <h6 className="card-title" style={{ height: "50px" }}>
                                                    <Link to={"/Tienda/MostrarLibro/" + item.ISBN13} className="text-decoration-none">{item.Titulo}</Link>
                                                </h6>
                                                <div className="mt-4 card-text">{item.Autores}</div>
                                                <div className="card-text"><small className="text-muted">{item.NumeroPaginas} págs.</small></div>
                                                <div className="card-text"><strong>{item.Precio} €</strong></div>
                                                <button className="btn btn-primary btn-sm mt-2" onClick={AddLibroToPedido} id={"buttAdd-" + item.ISBN13}>
                                                    Añadir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Libros;