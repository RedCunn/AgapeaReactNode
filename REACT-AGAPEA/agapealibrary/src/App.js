import React, { createContext, useContext, useState } from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import tiendaRESTService from "./services/restTienda";
import Login from "./components/zonaCliente/Login";
import RegisterForm from "./components/zonaCliente/RegisterForm";
import Layout from "./components/zonaTienda/layouts/Layout";
import Libros from "./components/zonaTienda/librosComponents/Libros";
import MostrarLibro from "./components/zonaTienda/librosComponents/MostrarLibro";
import Pedido from "./components/zonaTienda/pedidoComponents/Pedido";
import SimpleLayout from "./components/zonaTienda/layouts/SimpleLayout";
import {themes} from "./contexts/themes";

const routerObjects = createBrowserRouter(
  [
    //si quieres un layout creas un obj json sin path, con propiedad children
    {
      element: <Layout />,
      loader: tiendaRESTService.recuperarCategorias,
      children: [
        { path: '/', element: <Navigate to="/Tienda/Libros" /> },
        { path: 'Tienda/Libros/:idCategoria?', element: <Libros />, loader: tiendaRESTService.recuperarLibros },
        { path: '/Tienda/MostrarLibro/:isbn13', element: <MostrarLibro /> }//<--- se podria usar un loader pero uso hook: useEffect
      ]
    },
    { path: '/Cliente/login', element: <Login /> },
    { path: '/Cliente/register', element: <RegisterForm /> },
    {
      element: <SimpleLayout />,
      children: [
        { path: '/Tienda/pedido', element: <Pedido /> }
      ]
    }
  ]
);
//-------------------- contextos para pasar variables globales a componentes
const ThemeContext = createContext(null);
const ClienteLoggedContext = createContext(null);
const CartItemsContext = createContext([]);

function App() {

  let [clienteLogged, setClienteLogged] = useState(null);
  let [cartItems, setCartItems] = useState([]);
  let [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{theme, setTheme, themes}}>
      <ClienteLoggedContext.Provider value={{ clienteLogged, setClienteLogged }}>
        <CartItemsContext.Provider value={{ cartItems, setCartItems }}>
          <RouterProvider router={routerObjects}>
          </RouterProvider>
        </CartItemsContext.Provider>
      </ClienteLoggedContext.Provider>
    </ThemeContext.Provider>

  );
}

export function useThemeContext(){
  return useContext(ThemeContext);
}
//--------------- exporto hooks personalizados para que les hijes puedan usar sus variables de contexto global
// 1º valor : {clienteLogged: {datoscliente:...,jwt:...}, setClienteLogged: function(){....}}
// 2º valor : {cartItems: [......], setCartItems: function(){........}}

export function useClienteLoggedContext() {
  return useContext(ClienteLoggedContext);
}

export function useCartItemsContext() {
  return useContext(CartItemsContext);
}

export default App;


