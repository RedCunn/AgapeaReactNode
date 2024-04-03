import { useState, useEffect, useReducer } from 'react';

function MiniDireccion({ direccion, setDireccionModal, showModal, dispatch }) {
    //#region -------- STATES
    //#endregion

    //#region --------- EFFECTS
    //#endregion

    //#region -------- EVENT HANDLERS
    function ButtonsClickHandler(ev) {
        let [_button, _idDireccion] = ev.target.id.split('-');

        switch (_button.replace('button', '')) {
            case 'Editar':
                //disparar el showModal y pasarle al modal la direccion q estoy pintando con funcion setter del state de InicioPanel...
                setDireccionModal({ type: 'editar', direccion });
                showModal();
                break;
            case 'Eliminar':
                //dispatch de accion al reducer para eliminar direccion del cliente...

                break;
            default:
                break;
        }
    }
    //#endregion

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{direccion.calle}</h5>
                <p className="card-text">CP: {direccion.cp}, Municipio: {direccion.municipio.DMUN50} (Provincia: {direccion.provincia.PRO}, Pais: {direccion.pais})</p>
                <div className='d-flex justify-content-between'>
                    <button id={`buttonEditar-${direccion._id}`} className="btn btn-outline-primary btn-sm" onClick={ButtonsClickHandler} >Editar Direccion</button>
                    <button id={`buttonEliminar-${direccion._id}`} className="btn btn-outline-danger btn-sm" onClick={ButtonsClickHandler} >Eliminar Direccion</button>
                </div>
            </div>
        </div>
    );
}

export default MiniDireccion;