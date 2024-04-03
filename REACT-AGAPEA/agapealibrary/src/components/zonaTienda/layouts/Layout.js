import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../../../css/laystyle.css"
import { useClienteLoggedContext } from '../../../contexts/clienteLoggedContext';

function Layout() {
    //const { theme, themes } = useThemeContext();
    //style={{backgroundColor: themes[theme].backgroundColor, color: themes[theme].textColor }}
    let { clienteLogged } = useClienteLoggedContext();

    let _listaCategorias = useLoaderData();//el hook loaderData recupera del loader asociado los datos
    let _location = useLocation(); //<------------- hook para obtener objeto Location actual
    console.log('objeto location...', _location);

    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        {
                            !new RegExp("/Cliente/Panel/.*").test(_location.pathname) ?
                                (
                                    <>
                                        <h4>Categorias</h4>
                                        <div className="list-group" style={{ marginLeft: 0 }}>
                                            {_listaCategorias.map((cat) => <Link key={cat.idCategoria} to={"/Tienda/Librosv2/" + cat.idCategoria}
                                                className="list-group-item list-group-item-action"> {cat.NombreCategoria}</Link>)}
                                        </div>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <h5 className="text-dark mt-4 ms-3">Panel personal</h5>
                                        <div className="container">
                                            
                                            <div className="row" style={{marginLeft:'8%', background: "linear-gradient(to right, black, blue)", borderRadius:'20px 20px 0px 0px', width:'80%' }}>
                                                <div className="col">
                                                    <p style={{color:'white', marginBottom:'0'}}><big><strong> {clienteLogged.datoscliente.cuenta.login}</strong></big></p>
                                                </div>
                                            </div>
                                            <div className="row" style={{marginLeft:'8%', background: "linear-gradient(to right, black, blue)", borderRadius:'0px 0px 20px 20px',width:'80%' }}>
                                                <div className="col text-center mb-4">
                                                    <img src="/img/winprofile.jpg" style={{ width: "140px", height: "140px",borderRadius:'20px'}} alt="" />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col">
                                                    <div className="list-group">
                                                        {
                                                            _listaCategorias.map(
                                                                (cat, i) => <Link key={i} className="list-group-item list-group-item-action border border-end-0 border-start-0 text-dark" to={cat === 'Mis Pedidos' ? '/Cliente/Panel/MisPedidos':'/'}>
                                                                    {cat} 
                                                                </Link>
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                        }

                    </div>
                    <div className="col-9" style={{ marginTop: "2%", marginBottom: "13%" }}>
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Layout;