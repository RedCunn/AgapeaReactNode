import { useLoaderData, Link, useNavigate } from "react-router-dom";
import {useItemsCarroContext} from '../../../contexts/itemsCarroContext';
import {useClienteLoggedContext} from '../../../contexts/clienteLoggedContext';
function Librosv2() {

    let {clienteLogged} = useClienteLoggedContext();
    let { dispatch } = useItemsCarroContext();
    let _listaLibros = useLoaderData();
    const navigate = useNavigate();

    function AddLibroToPedido(ev) {
        let _isbn13 = ev.target.id.split('-')[1];
        console.log('id del libro que quieres añadir: ', _isbn13);

        let _newitem = _listaLibros.find(item => item.ISBN13 === _isbn13);

        dispatch({type:'ADD_NEW_ITEM',payload:{libroElemento: _newitem, cantidadElemento: 1}});

        if(clienteLogged){
            navigate('/Tienda/pedido');
        }

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

export default Librosv2;