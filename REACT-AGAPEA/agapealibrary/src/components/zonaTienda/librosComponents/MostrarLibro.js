import { useEffect, useState, useRef, useLoaderData } from "react";
import { useParams } from "react-router-dom"; //<--- hook para extraer params de la ruta (:isbn13 en este caso)
// devuelve un objeto asi : {nombre_param: valor, nombre_param: valor,....}
import tiendaRESTService from "../../../services/restTienda";
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import { useItemsCarroContext } from '../../../contexts/itemsCarroContext';
import ModalComentario from '../librosComponents/ModalComentario';
import "../../../css/bookdetail.css";

function MostrarLibro() {

    let { isbn13 } = useParams();
    //#region -------- STATES
    const { clienteLogged, dispatch: clienteDispatch } = useClienteLoggedContext();
    const { dispatch: carroDispatch } = useItemsCarroContext();

    let [libro, setLibro] = useState({});
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    let _modalRef = useRef(null);
    let _valorInicialValoracionModal = {
        puntuacion: 0,
        comentario: '',
        user: clienteLogged ? clienteLogged.datoscliente._id : '',
        libro: isbn13 
    };
    let [valoracionModal, setValoracionModal] = useState(_valorInicialValoracionModal);
    //#endregion

    //#region --------- EFFECTS 
    let valoracionesCount = 0;
    let comentariosCount = 0;
    let opiniones = []
    useEffect(
        function () {
            //hacer pet.fetch para recuperar libro con isbn13 y rellenar la variable del state libro con setlibro
            // invocando a tiendaRESTservice.recuperarLibro(...)
            async function fetchdata(isbn) {
                let _libroRecup = await tiendaRESTService.retrieveSingleBook(isbn);

                for (const lib of _libroRecup.valoraciones){
                    valoracionesCount+=1;
                    for(const com of lib){
                        const {puntucion, comentario, user} = lib;
                        comentariosCount+= 1;
                        opiniones.push(
                            puntucion,
                            comentario,
                            user
                        )
                    }
                }

                setLibro(_libroRecup);
                setValoracionModal({
                    ..._valorInicialValoracionModal,
                    libro: libro._id
                });
            }

            fetchdata(isbn13);
        },
        []
    );
    console.log('LIBRITO: ',libro);
    console.log('VALORACIONES: ',valoracionesCount);
    console.log('COMENTARIOS: ',comentariosCount)
    console.log('OPINIONES: ',opiniones)
    //#endregion

    //#region -------- FUNCIONES 
    function AddLibroToPedido(ev) {

        console.log('id del libro que quieres añadir: ', isbn13);
        carroDispatch({ type: 'ADD_NEW_ITEM', payload: { libroElemento: libro, cantidadElemento: 1 } });
    }
    //#endregion

    //#region -------- EVENT HANDLERS

    function HandlerSummary() {
        setIsSummaryExpanded(!isSummaryExpanded);
    }

    // function cambiarColor(ev) {
    //     let count = parseInt(ev.target.id[0]);
    //     const star = ev.target.id.substr(1);
    //     let starElement = '';
    //     for (let i = 1; i <= 5; i++) {
    //         starElement = document.getElementById(i + star);
    //         if (i <= count) {
    //             starElement.classList.add('star-selected');
    //         } else {
    //             starElement.classList.remove('star-selected');
    //         }
    //     }
    // }

    // function restablecerColor(ev) {
    //     const star = ev.target.id.substr(1);
    //     let starElement = '';
    //     for (let i = 1; i <= 5; i++) {
    //         starElement = document.getElementById(i + star);
    //         starElement.classList.remove('star-selected');
    //     }
    // }

    function calificar(ev) {
        const count = parseInt(ev.target.id[0]);
        if(clienteLogged !== null){
            setValoracionModal({
                ..._valorInicialValoracionModal,
                puntuacion: count
            });
    
        }
    console.log(`Puntuaste ${count} estrellas`);
    }
    //#endregion

    return (
        <div className="row ms-5">
            <div className="col-8">
                <div className="mb-3" style={{ maxWidth: "540px" }}>
                    <div className="row g-0">
                        <div className="col-md-4" style={{ height: "170px" }}>
                            <div className="w-100" style={{ height: "80%" }}>
                                <img style={{ width: "100%" }} src={libro.ImagenLibroBASE64} className="img-fluid rounded-start" alt="..." />
                            </div>
                        </div>
                        <div className="col-md-8 ps-1">
                            <div className="ms-3">
                                <h5 className="card-title">{libro.Titulo}</h5>
                                <h6 className="card-text">{libro.Autores}</h6>
                                <hr />
                                <h6>Detalles del libro</h6>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="card-text text-muted">Editorial</div>
                                        <div className="card-text text-muted">Edición</div>
                                        <div className="card-text text-muted">Páginas</div>
                                        <div className="card-text text-muted">Dimensiones</div>
                                        <div className="card-text text-muted">Idioma</div>
                                        <div className="card-text text-muted">ISBN</div>
                                        <div className="card-text text-muted">ISBN-10</div>
                                    </div>
                                    <div className="col-9 ps-4">
                                        <div className="card-text">{libro.Editorial}</div>
                                        <div className="card-text">{libro.Edicion}</div>
                                        <div className="card-text">{libro.NumeroPaginas} </div>
                                        <div className="card-text">{libro.Dimensiones}</div>
                                        <div className="card-text">{libro.Idioma}</div>
                                        <div className="card-text">{libro.ISBN13}</div>
                                        <div className="card-text">{libro.ISBN10}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="card mt-3">
                            <p id="summary"
                                className={`card-body ${isSummaryExpanded ? "allsummary" : ""}`}
                                style={{ height: isSummaryExpanded ? "auto" : "90px", overflow: "hidden" }}>
                                <small>{libro.Resumen}</small>
                            </p>
                            <button id="show-more" onClick={HandlerSummary}>
                                <small>{isSummaryExpanded ? "Ver menos" : "Ver más"}</small>
                            </button>
                        </div>
                        <div className="card" style={{ width: '100%', marginTop: '5%' }}>
                            <div className="card-body text-center">
                                <p className="card-text">Danos tu valoración de este libro</p>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <box-icon
                                        key={num}
                                        name="star"
                                        className="star-icon"
                                        id={`${num}star`}
                                        type="solid"
                                        onClick={calificar}
                                        data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                    ></box-icon>
                                ))}
                            </div>
                            <p className="ms-2"><small>{valoracionesCount} valoraciones, {comentariosCount} opiniones</small></p>
                            <ul className="list-group list-group-flush">
                                {
                                    opiniones.length > 0 && opiniones.map((op, i)=>(
                                        <li className="list-group-item">
                                            <p>{op.puntuacion}</p>
                                            <p>{op.comentario}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <ModalComentario ref={_modalRef} valoracionModal={valoracionModal} dispatch={clienteDispatch}></ModalComentario>
                    </div>
                </div>
            </div>

            <div className="col-4 px-0">
                <div className="bg-light p-3 border border-1">
                    <div className="container bg-white border border-1 p-2" style={{marginLeft:'0%'}}>
                        <div className="d-flex flex-row-reverse align-items-end w-100">
                            <h4 className="mx-2">€</h4><h2>{libro.Precio}</h2>
                        </div>
                        <div className="container px-3">
                            <div className="row">
                                <div className="col-4 border border-2 border-primary d-flex align-items-center justify-content-center"><box-icon name='car' color='#068df7' ></box-icon></div>
                                <div className="col-8 border border-2 border-primary border-start-0 d-flex flex-column justify-content-center p-2">
                                    <div className="d-flex justify-content-around"><span className="text-primary"><strong>Envío Gratis</strong><i className="fa-solid fa-circle-info mx-2"></i></span> </div>
                                    <div className="d-flex justify-content-around"><span className="text-primary"><small>al comprar este libro</small></span></div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center py-3 px-1">
                            <button className="btn btn-primary w-100 p-2" id={"btnComprar-" + libro.ISBN13} onClick={AddLibroToPedido} style={{ borderRadius: "0px" }}><i className="fa-solid fa-cart-shopping pe-2"></i><strong> Comprar / Recoger</strong></button>
                        </div>
                        <div className="d-flex flex-row justify-content-between px-1">
                            <button className="btn btn-outline-primary p-2 flex-fill" style={{ borderRadius: "0px" }}> <small>Agregar a la lista de deseos</small></button>

                            <a id="despliega-listas" className="btn btn-outline-primary ms-2 border border-1 border-primary position-relative" style={{ borderRadius: "0px" }}>
                                <strong>:</strong>
                                <div className="position-absolute top-100 start-0 visually-hidden" id="dropdown-listas" style={{ width: "150px" }}>
                                    <div className="btn btn-outline-primary w-100" style={{ borderRadius: "0px" }}>Agregar nueva lista</div>
                                    <div className="btn btn-outline-primary border-top-0 w-100" style={{ borderRadius: "0px" }}>Ver más listas</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}

export default MostrarLibro;