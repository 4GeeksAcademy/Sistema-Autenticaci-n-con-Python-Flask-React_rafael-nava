import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import styles from "./login.module.css"; // Importación de estilos CSS
import { Link } from "react-router-dom"; // Importación de Link para la navegación
import { Context } from "../store/appContext"; // Importación del contexto
import { useNavigate } from "react-router-dom"; // Importación de useNavigate para la navegación programática

const Login = () => { // Definición del componente Login
    const { store, actions, getStore } = useContext(Context); // Obtención del estado global y las acciones desde el contexto
    const { loginUser } = store; // Obtención de los datos de inicio de sesión desde el estado global

    const navigate = useNavigate(); // Obtención de la función navigate de react-router-dom

    const callHandleLogin = async (e) => { // Función para manejar el inicio de sesión
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        try {
            await actions.handleLogin(); // Llamada a la acción handleLogin para iniciar sesión
            const { login_true_o_false } = store; // Acceso al estado de inicio de sesión desde el estado global
            await actions.loadUserData(); // Llamada a la acción loadUserData para cargar los datos del usuario
            await actions.loadDataStartWars(); // Llamada a la acción loadDataStartWars para cargar datos de Star Wars

            if (login_true_o_false) { // Verifica si el inicio de sesión fue exitoso
                navigate("/People"); // Redirige a la página de People si el inicio de sesión fue exitoso
            }

        } catch (error) {
            // console.error('Error:', error);
            // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
        }
    };

    const renderLoginResponse = () => { // Función para renderizar la respuesta del inicio de sesión
        const { loginState } = store; // Acceso al estado de inicio de sesión desde el estado global
        if (loginState.length > 0) { // Verifica si hay una respuesta de inicio de sesión
            if (loginState[0].error) { // Verifica si hay un error en el inicio de sesión
                return (
                    <div className="alert alert-danger" role="alert"> {/* Muestra el mensaje de error */}
                        <p>{loginState[0].error}</p>
                    </div>
                );
            } else { // Si no hay error, muestra un mensaje de éxito
                return (
                    <div className="alert alert-success" role="alert">
                        <p>Correct password</p>
                    </div>
                );
            }
        }
    };

    return (
        <div className={styles.loginform}> {/* Contenedor principal del formulario de inicio de sesión */}
            <h2>Inicia sesión</h2> {/* Título del formulario */}
            <div>
                {renderLoginResponse()} {/* Renderiza la respuesta del inicio de sesión */}
            </div>
            <form onSubmit={callHandleLogin}> {/* Formulario para enviar la solicitud de inicio de sesión */}
                <label>
                    Email: {/* Campo de entrada para el correo electrónico */}
                    <input type="email" name="email" value={loginUser.email.trim()} onChange={actions.handleChangeLogin} required />
                </label>
                <label>
                    Contraseña: {/* Campo de entrada para la contraseña */}
                    <input type="password" name="password" value={loginUser.password} onChange={actions.handleChangeLogin} required />
                </label>
                <button type="submit" className={styles.submitButtonLogin}>Iniciar sesión</button> {/* Botón para enviar la solicitud de inicio de sesión */}
                <Link to="/LoginHelp">¿Olvidaste la contraseña?</Link> {/* Enlace para la ayuda de contraseña */}
                <div className="rememberMe"> {/* Sección para recordar sesión */}
                    <input type="checkbox" /> {/* Checkbox para recordar sesión */}
                    <span>Recuérdame</span> {/* Texto para recordar sesión */}
                    <p>¿Es tu primera vez aquí? <Link to="/Singup">Regístrate ahora.</Link></p> {/* Enlace para registrarse */}
                </div>
            </form>
        </div>
    );
};

export default Login; // Exportación del componente Login
