import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import clienteRESTservice from '../../../services/restCliente';

const ModalComentario = forwardRef(
    function ModalComentario({ valoracionModal, dispatch }, ref) {
        console.log('valoracion modal puntuacion for starters ::: ', valoracionModal.puntuacion)
        //#region -------- STATES
        let _divModal = useRef(null);
        let { clienteLogged } = useClienteLoggedContext();
        let [miValoracion, setMiValoracion] = useState(valoracionModal);
        //#endregion

        //#region --------- EFFECTS
        //#endregion

        //#region -------- EVENT HANDLERS
        //-------- valores expuestos al comp.root atraves de la ref. redirigida a obj return del hook: useImperativeHandle
        // Mantén una referencia mutable local
        const divModalRef = useRef(_divModal);

        // Actualiza la referencia local cuando _divModal cambia
        useEffect(() => {
            divModalRef.current = _divModal;
        }, [_divModal]);

        useEffect(() => {
            setMiValoracion(valoracionModal);
          }, [valoracionModal]);

        // Resto del código...

        useImperativeHandle(
            ref,
            () => {
                return {
                    showModal: function () {
                        // Utiliza la referencia local
                        window.bootstrap.Modal.getOrCreateInstance(divModalRef.current.current).show();
                    },
                    hideModal: function () {
                        // Utiliza la referencia local
                        window.bootstrap.Modal.getOrCreateInstance(divModalRef.current.current).hide();
                    },
                    modalBootstrapObject: divModalRef.current.current,
                };
            }
        );
        function handleTextAreaChange(ev) {
            let { value } = ev.target;

            setMiValoracion((miValoracion) => {
                return {
                    ...miValoracion,
                    'comentario': value
                }
            });
        }

        const handleLoginClick = () => {
            const modal = document.getElementById('staticBackdrop');
            const modalInstance = new window.bootstrap.Modal(modal);
            modalInstance.hide();

            window.location.href = '/Cliente/login';

        };
        async function handleSubmit(ev) {

            ev.preventDefault();

            console.log('mi valoracion---------', miValoracion);

            let email = clienteLogged.datoscliente.cuenta.email;
            let jwt = clienteLogged.jwt;

            try {
                let _respServ = await clienteRESTservice.AddComment( miValoracion, email , jwt);
                console.log('respuesta del server al intentar valora: ', _respServ);

                if (_respServ.codigo === 0) {

                }

            } catch (error) {
                console.log('error al intentar valorar libro ', error)
            }


        }
        //#endregion

        return (
            <>
                <div ref={_divModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ marginTop: '15%' }}>
                        {
                            clienteLogged !== null ? (
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h6 className="modal-title">Has compartido tu puntuación. Añade un comentario.</h6>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-body">
                                            <textarea style={{ resize: 'none', fontStyle: 'italic', width: '100%' }} id="textArea" name='comentario' placeholder="Déjanos un comentario..." maxLength={200} minLength={15} onChange={handleTextAreaChange}></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="submit" className="btn btn-primary">Guardar comentario</button>
                                        </div>
                                    </form>
                                </div>
                            ) :
                                (
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h6 className="modal-title">Para valorar tienes que tener cuenta... 👻</h6>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <Link to="/Cliente/login" className="btn btn-primary" onClick={handleLoginClick}>
                                                <box-icon name="user" type="solid" color="#ffff"></box-icon>
                                                <p>Login</p>
                                            </Link>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                )
                        }

                    </div>
                </div>
            </>
        );
    }

)
export default ModalComentario;