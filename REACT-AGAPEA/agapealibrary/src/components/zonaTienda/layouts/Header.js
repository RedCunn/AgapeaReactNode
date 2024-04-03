import React from "react";
import { Link } from "react-router-dom";
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';
import { useItemsCarroContext } from '../../../contexts/itemsCarroContext';

function Header() {

    let { clienteLogged } = useClienteLoggedContext();
    console.log('valor del state global clienteLogged...', clienteLogged);
    let { itemsCarro } = useItemsCarroContext();


    function itemsCount() {
        let count = 0;

        if (itemsCarro.length > 0) {
            itemsCarro.forEach(item => {
                count += item.cantidadElemento;
            });
        }

        return count;
    }

    function totalCount() {
        let count = 0;

        if (itemsCarro.length > 0) {
            itemsCarro.forEach(item => {
                count += (item.libroElemento.Precio * item.cantidadElemento)
            })
        }

        return count;
    }

    return (
        <header>
            <div className="nav justify-content-end bg-dark">
                <button className="me-auto p-2" style={{ border: "none", width: "fit-content", backgroundColor: "#212529" }}>
                    <box-icon name='sun' type='solid' color='#929090' ></box-icon></button>
                <Link to="#" className="nav-link active">
                    <box-icon name='phone' type='solid' color='#585757'></box-icon>
                    Contacto
                </Link>
                {!clienteLogged ?
                    (
                        <Link to="/Cliente/login" className="nav-link me-3">
                            <box-icon name="user" type="solid" color="#2d66f7"></box-icon>
                            Login
                        </Link>
                    )
                    :
                    (
                        <Link to="/Cliente/Panel/InicioPanel" className="nav-link me-3">
                            <box-icon name="user" type="solid" color="#2d66f7"></box-icon>
                            {clienteLogged.datoscliente.cuenta.email}
                        </Link>
                    )
                }
            </div>

            <div className="row d-flex flex-row justify-content-between mx-5" >

                <div className="col-4 d-flex justify-content-start">
                    <Link to="/Tienda/Librosv2"> <img style={{ width: "300px" }} src="/img/logo-agapea.jpg" alt="" /></Link>
                </div>

                <div className="col-4 mt-4 d-flex justify-content-center">
                    <form className="d-flex" role="search" method="post">
                        <input className="form-control me-2" type="search" placeholder="Buscar por libro, autor, ISBN..." aria-label="Search" style={{ height: "50px", width: "300px" }} />
                        <button className="btn btn-primary" type="submit" style={{ height: "50px" }}><box-icon name='search-alt' color='#ffffff'></box-icon></button>
                    </form>
                </div>

                <div className="col-4 d-flex justify-content-end">
                    <div className="mt-2 d-flex flex-row align-items-center border border-gray border-4" style={{ width: "fit-content", height: "fit-content", borderRadius: "25px" }}>
                        <div className="row d-flex flex-column align-items-center p-3">
                            <box-icon name='cart-alt' color='#f30505'></box-icon>
                            <p id="unidadesCarrito" className="border border-primary border-1" style={{ width: "fit-content", borderRadius: "10px" }}>{itemsCount()}</p>
                        </div>
                        <div className="row text-dark badge badge-danger pe-1">
                            <span className="text-end" id="precioCarrito" style={{ width: "110px", fontSize: "1.6em" }}>
                                {totalCount().toFixed(2)} €</span>
                            {
                                clienteLogged ? 
                                (
                                    <Link to="/Tienda/pedido">
                                        <box-icon name='right-arrow-square' type='solid' color='#f30505' size="md"></box-icon>
                                    </Link>
                                ) 
                                :
                                (
                                    <Link to="/Cliente/login">
                                        <box-icon name='right-arrow-square' type='solid' color='#f30505' size="md"></box-icon>
                                    </Link>
                                )
                            }

                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;