import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import styles from "./navbar.module.css"; // Importación de estilos CSS
import { Link } from "react-router-dom"; // Importación de Link para la navegación
import { Context } from "../store/appContext"; // Importación del contexto
import { useNavigate } from "react-router-dom"; // Importación de useNavigate para la navegación programática

const Navbar = () => { // Definición del componente Navbar
    const { store, actions, setStore, getStore } = useContext(Context); // Obtención del estado global, las acciones y la función setStore desde el contexto
    const { login_true_o_false, recoveredUserData } = store; // Obtención del estado de inicio de sesión y los datos recuperados del usuario desde el estado global
    const navigate = useNavigate(); // Obtención de la función navigate de react-router-dom

    const handleCloseSession = async () => { // Función para cerrar la sesión del usuario
        await actions.closeSession(); // Llamada a la acción closeSession para cerrar sesión
        localStorage.removeItem("token"); // Eliminación del token del localStorage
        navigate("/"); // Redirección a la página de inicio
        window.location.reload(); // Recarga la página
    };

    return ( // Renderizado del componente Navbar
        <nav className={styles.navbar}> {/* Definición de la barra de navegación con estilos dinámicos */}
            <div className="container-fluid d-flex justify-content-between align-items-center"> {/* Contenedor principal de la barra de navegación */}
                <div className={styles.logo}> {/* Logotipo de la barra de navegación */}
                <Link to="/"> {/* Enlace al inicio de la aplicación */}
                   <img src="https://png.pngtree.com/png-vector/20230814/ourmid/pngtree-star-wars-stormtrooper-sticker-vector-png-image_6896914.png" alt="Logo" title="Ir a home"/> {/* Imagen del logotipo */}
                </Link>
                </div>
                <div> {/* Contenedor de los elementos de la barra de navegación */}
                    {login_true_o_false && ( // Condición para renderizar el botón de cierre de sesión si el usuario ha iniciado sesión
                        <button className={styles.logoutButton} onClick={handleCloseSession}>Cerrar sesión</button>
                    )}
                    {!login_true_o_false && ( // Condición para renderizar el botón de inicio de sesión si el usuario no ha iniciado sesión
                        <Link to="/Login">
                            <button className={styles.loginButton}>Iniciar sesión</button>
                        </Link>
                    )}
                    {login_true_o_false && ( // Condición para renderizar el botón de perfil si el usuario ha iniciado sesión
                        <button className={styles.ProfileButton} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <i class="fa-regular fa-user"></i> {/* Icono de perfil */}
                        </button>
                    )}
                </div>
            </div>
            <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel"> {/* Menú desplegable para el perfil del usuario */}
                <div className="offcanvas-header"> {/* Cabecera del menú desplegable */}
                    <h3 className="offcanvas-title" id="offcanvasNavbarLabel">Bienvenido: {recoveredUserData.name} {recoveredUserData.last_name}</h3> {/* Título del menú desplegable */}
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button> {/* Botón para cerrar el menú desplegable */}
                </div>
                <div className="offcanvas-body"> {/* Cuerpo del menú desplegable */}
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3"> {/* Lista de elementos del menú desplegable */}
                        <li className="nav-item"> {/* Elemento de la lista para mostrar el nombre de usuario */}
                            <h5 className={styles["nav-link"]} aria-current="page">Usuario: {recoveredUserData.username}</h5>
                        </li>
                        <li className="nav-item"> {/* Elemento de la lista para mostrar el correo electrónico del usuario */}
                            <h5 className={styles["nav-link"]} aria-current="page">Email: {recoveredUserData.email}</h5>
                        </li>
                        <li className="nav-item dropdown"> {/* Elemento de la lista para mostrar las preguntas de seguridad del usuario */}
                            <a className="nav-link dropdown-toggle" href="#" id={styles["offcanvasNavbarDropdown"]} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Datos de seguridad: {/* Enlace para desplegar el menú de preguntas de seguridad */}
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown"> {/* Menú desplegable de preguntas de seguridad */}
                                <li>
                                    <a className="dropdown-item" href="#">Preguntas de seguridad:</a> {/* Título del menú desplegable */}
                                    <ol>
                                        <li>{recoveredUserData.security_questions_question1}</li> {/* Primera pregunta de seguridad */}
                                        <li>{recoveredUserData.security_questions_question2}</li> {/* Segunda pregunta de seguridad */}
                                    </ol>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/> {/* Separador horizontal entre las preguntas de seguridad */}
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">Preguntas de seguridad:</a> {/* Título del menú desplegable */}
                                    <ol>
                                        <li>{recoveredUserData.security_questions_answer1}</li> {/* Primera respuesta de seguridad */}
                                        <li>{recoveredUserData.security_questions_answer2}</li> {/* Segunda respuesta de seguridad */}
                                    </ol>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; // Exportación del componente Navbar
