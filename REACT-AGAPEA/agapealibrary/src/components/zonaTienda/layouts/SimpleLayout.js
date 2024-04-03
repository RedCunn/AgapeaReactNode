import { Link, Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import "../../../css/laystyle.css"

function SimpleLayout() {


    return (
        <>
            <Header />
            <div className="container mt-5">
                <Outlet />
            </div>

            <Footer />
        </>
    );
}


export default SimpleLayout;