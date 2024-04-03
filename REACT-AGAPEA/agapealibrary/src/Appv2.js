import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import tiendaRESTService from "./services/restTienda";
import Login from "./components/zonaCliente/Login";
import RegisterForm from "./components/zonaCliente/RegisterForm";
import Layout from "./components/zonaTienda/layouts/Layout";
import Librosv2 from "./components/zonaTienda/librosComponents/Librosv2";
import MostrarLibro from "./components/zonaTienda/librosComponents/MostrarLibro";
import Pedidov2 from "./components/zonaTienda/pedidoComponents/Pedidov2";
import SimpleLayout from "./components/zonaTienda/layouts/SimpleLayout";
import { ClienteLoggedProvider } from "./contexts/clienteLoggedContext";
import { ItemsCarroProvider } from "./contexts/itemsCarroContext";
import InicioPanel from "./components/zonaCliente/inicioPanelcomponents/InicioPanel";
import MisPedidos from "./components/zonaCliente/inicioPanelcomponents/MisPedidos";
const routerObjects = createBrowserRouter(
    [
        {
            element: <Layout />,
            loader: tiendaRESTService.retrieveCategories,
            children: [
                { path: '/', element: <Navigate to="/Tienda/Librosv2" /> },
                { path: 'Tienda/Librosv2/:idCategoria?', element: <Librosv2 />, loader: tiendaRESTService.retrieveBooks },
                { path: '/Tienda/MostrarLibro/:isbn13', element: <MostrarLibro />}
            ]
        },
        { path: '/Cliente/login', element: <Login /> },
        { path: '/Cliente/register', element: <RegisterForm /> },
        {
            element: <SimpleLayout />,
            children: [
                { path: '/Tienda/pedido', element: <Pedidov2 /> }
            ]
        },
        {
            path: '/Cliente/Panel',
            element: <Layout/>,
            loader: async ()=>{ return ["Inicio Panel", "Mis Pedidos","Mis Opiniones","Mis Listas"] }, 
            children:[
                        { path: 'InicioPanel', element:<InicioPanel/>},
                        {path:'MisPedidos', element: <MisPedidos/>}

            ]
          }

    ]
);
function Appv2() {


    return (
        <ClienteLoggedProvider>
            <ItemsCarroProvider>
                <RouterProvider router={routerObjects}>
                </RouterProvider>
            </ItemsCarroProvider>    
        </ClienteLoggedProvider>
    );
}

export default Appv2;