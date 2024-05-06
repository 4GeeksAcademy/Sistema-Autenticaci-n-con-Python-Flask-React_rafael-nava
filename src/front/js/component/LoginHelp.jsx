import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import styles from "./LoginHelp.module.css"; // Importación de estilos CSS
import { Link } from "react-router-dom"; // Importación de Link para la navegación
import { Context } from "../store/appContext"; // Importación del contexto
import { useNavigate } from "react-router-dom"; // Importación de useNavigate para la navegación programática

const LoginHelp = () => { // Definición del componente LoginHelp
    const { store, actions, setStore, getStore } = useContext(Context); // Obtención del estado global, las acciones y la función setStore desde el contexto
    const { loginHelpUser, UserPasswordUpdateState } = store; // Obtención del estado de ayuda para inicio de sesión y el estado de actualización de la contraseña desde el estado global
    const navigate = useNavigate(); // Obtención de la función navigate de react-router-dom

    const [securityData, setSecurityData] = useState({ answer1: "", answer2: "" }); // Estado local para las respuestas de seguridad
    const [showPassword, setShowPassword] = useState(false); // Estado local para mostrar la contraseña después de verificar las respuestas de seguridad

    const callLoginHelp = async (e) => { // Función para llamar a la ayuda de inicio de sesión
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        try {
            await actions.LoginHelp(); // Llamada a la acción LoginHelp para obtener ayuda para el inicio de sesión
            await actions.userDataHelp(); // Llamada a la acción userDataHelp para obtener los datos del usuario
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
        }
    };

    const ChangeAnswerLoginHelp = (e) => { // Función para manejar el cambio en las respuestas de seguridad
        setSecurityData({ ...securityData, [e.target.name]: e.target.value }); // Actualiza el estado de las respuestas de seguridad
    };

    const renderQuestions = () => { // Función para renderizar las preguntas de seguridad
        const { loginHelpUser_true_o_false, recoveredUserData } = store; // Acceso a los datos de inicio de sesión y los datos del usuario recuperados desde el estado global
        if (loginHelpUser_true_o_false) { // Verifica si se ha obtenido ayuda para el inicio de sesión
            return (
                <form onSubmit={renderPassword}> {/* Formulario para enviar las respuestas de seguridad */}
                    <h4>Preguntas de seguridad</h4>
                    <label>
                        Pregunta 1 {recoveredUserData.security_questions_question1}:
                        <input type="text" name="answer1" value={securityData.answer1.trim()} onChange={ChangeAnswerLoginHelp} required />
                    </label>
                    <label>
                        Pregunta 2 {recoveredUserData.security_questions_question2}:
                        <input type="text" name="answer2" value={securityData.answer2.trim()} onChange={ChangeAnswerLoginHelp} required />
                    </label>
                    <button type="submit" className={styles.submitButtonVerify}>Verificar Preguntas</button>
                </form>
            );
        }
    };

    const renderPassword = (e) => { // Función para renderizar el formulario de nueva contraseña
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const { recoveredUserData } = store; // Acceso a los datos del usuario recuperados desde el estado global

        if (recoveredUserData.security_questions_answer1 !== securityData.answer1) { // Verifica si la respuesta 1 es correcta
            console.log("La respuesta 1 no es correcta");
        } else if (recoveredUserData.security_questions_answer2 !== securityData.answer2) { // Verifica si la respuesta 2 es correcta
            console.log("La respuesta 2 no es correcta");
        } else {
            setShowPassword(true); // Muestra el formulario de nueva contraseña
        }
    };

    const renderHelpResponse = () => { // Función para renderizar la respuesta de ayuda
        const { loginHelpUserError } = store; // Acceso al error de ayuda desde el estado global
        if (loginHelpUserError.length > 0) { // Verifica si hay un error de ayuda
            return (
                <div class="alert alert-danger" role="alert"> {/* Muestra el mensaje de error */}
                    <p>{loginHelpUserError}</p>
                </div>
            );
        }
    };

    const renderNewPassword = () => { // Función para renderizar el formulario de nueva contraseña
        const { UserPasswordUpdate } = store; // Acceso al estado de actualización de contraseña desde el estado global
        if (showPassword) { // Verifica si se debe mostrar el formulario de nueva contraseña
            return (
                <form onSubmit={HandlChangePassword}> {/* Formulario para enviar la nueva contraseña */}
                    <label>
                        <h4>Escribe tu nueva contraseña</h4>
                        <input type="password" name="password" value={UserPasswordUpdate.password.trim()} onChange={actions.ChangePasswordUpdate} required />
                    </label>
                    <button type="submit" className={styles.submitButtonLogin}>Recuperar contraseña</button>
                </form>
            );
        }
    };

    const HandlChangePassword = async (e) => { // Función para manejar el cambio de contraseña
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        try {
            await actions.userDataHelpChangePassword(); // Llamada a la acción userDataHelpChangePassword para cambiar la contraseña
            const { UserPasswordUpdateState } = store; // Acceso al estado de actualización de contraseña desde el estado global
            // console.log("UserPasswordUpdateState:", UserPasswordUpdateState);
            if (UserPasswordUpdateState["message"]) { // Verifica si hay un mensaje de éxito en la actualización de la contraseña
                setTimeout(() => { // Redirige a la página de inicio después de 3 segundos
                    navigate("/Login");
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
        }
    };

    const renderStatusChange = () => { // Función para renderizar el estado de cambio de contraseña
        if (UserPasswordUpdateState) { // Verifica si hay un estado de actualización de contraseña
            if (UserPasswordUpdateState.message) { // Verifica si hay un mensaje de éxito en la actualización de la contraseña
                return (
                    <div className="alert alert-success" role="alert"> {/* Muestra el mensaje de éxito */}
                        <h4>Su contraseña ha sido cambiada</h4>
                        <p>Se redireccionará a la página principal</p>
                    </div>
                );
            } else if (UserPasswordUpdateState.error) { // Verifica si hay un mensaje de error en la actualización de la contraseña
                return (
                    <div className="alert alert-danger" role="alert"> {/* Muestra el mensaje de error */}
                        <h4>{UserPasswordUpdateState.error}</h4>
                    </div>
                );
            }
        }
    };

    return (
        <div className={styles.loginform}> {/* Contenedor principal del formulario de ayuda para el inicio de sesión */}
            <h2>Recuperar contraseña</h2> {/* Título del formulario */}
            <div>
                {renderHelpResponse()} {/* Renderiza la respuesta de ayuda */}
            </div>
            <div>
                {renderStatusChange()} {/* Renderiza el estado de cambio de contraseña */}
            </div>
            <form onSubmit={callLoginHelp}> {/* Formulario para enviar la solicitud de ayuda para el inicio de sesión */}
                <label>
                    Email: {/* Campo de entrada para el correo electrónico */}
                    <input type="email" name="email" value={loginHelpUser.email.trim()} onChange={actions.ChangeLoginHelp} required />
                </label>
                <button type="submit" className={styles.submitButtonLogin}>Recuperar contraseña</button> {/* Botón para enviar la solicitud de ayuda */}
            </form>
            <br />
            {renderQuestions()} {/* Renderiza las preguntas de seguridad */}
            <br />
            {renderNewPassword()} {/* Renderiza el formulario de nueva contraseña */}
        </div>
    );
};

export default LoginHelp; // Exportación del componente LoginHelp
