import React from "react";
import { Link } from "react-router-dom";
import "../../../css/footer.css";

function Footer(){

    return(
        <footer className="border-top text-muted m-5">
            <div className="company mt-3">
                <p>© Agapea Factory S.A. 2002 - 2023. Reservados todos los derechos</p>
            </div>
            <div className="footerLinks">
                <Link>Aviso Legal</Link>
                <Link>Condiciones de Contratación</Link>
                <Link>Política de Privacidad</Link>
                <Link>Política de Cookies</Link>
                <Link>Librerías</Link>
            </div>
        </footer>
    );
}

export default Footer;