import React from "react"; // Importación de React
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Importación de componentes de react-router-dom
import ScrollToTop from "./component/scrollToTop"; // Importación del componente scrollToTop
import { BackendURL } from "./component/backendURL"; // Importación de la URL del backend

import { Home } from "./pages/home"; // Importación del componente Home
import { Footer } from "./component/footer";


import injectContext from "./store/appContext"; // Importación de la función injectContext desde el contexto de la aplicación

import Navbar from "./component/Navbar.jsx"; // Importación del componente Navbar
import Login from "./component/Login.jsx"; // Importación del componente Login
import LoginHelp from "./component/LoginHelp.jsx"; // Importación del componente LoginHelp
import Singup from "./component/Singup.jsx"; // Importación del componente Singup
import People from "./pages/People.jsx"; // Importación del componente People desde la página People
import Character from "./pages/Character.jsx"; // Importación del componente Character desde la página Character

// Crea tu primer componente
const Layout = () => {
    // El basename se usa cuando tu proyecto está publicado en un subdirectorio y no en la raíz del dominio
    // Puedes establecer el basename en el archivo .env ubicado en la raíz de este proyecto, Ejemplo: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    // Verifica si la URL del backend está definida en el entorno
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar /> {/* Renderiza el componente Navbar */}
                    <Routes>
                        <Route element={<Home />} path="/" /> {/* Ruta para el componente Home */}
                        <Route element={<Login />} path="/Login" /> {/* Ruta para el componente Login */}
                        <Route element={<LoginHelp />} path="/LoginHelp" /> {/* Ruta para el componente LoginHelp */}
                        <Route element={<Singup />} path="/Singup" /> {/* Ruta para el componente Singup */}
                        <Route element={<People />} path="/People" /> {/* Ruta para el componente People */}
                        <Route element={<Character />} path="/Character/:theid" /> {/* Ruta para el componente Character con parámetro */}
                        <Route element={<h1>Not found!</h1>} /> {/* Página de not found */}
                    </Routes>
                    <Footer /> {/* Renderiza el componente Footer */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout); // Exportación del componente Layout envuelto con el contexto
