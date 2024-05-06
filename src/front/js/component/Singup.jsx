import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import { Link } from "react-router-dom"; // Importación de Link para la navegación
import { Context } from "../store/appContext"; // Importación del contexto
import { useNavigate } from "react-router-dom"; // Importación de useNavigate para la navegación programática
import styles from "./Singup.module.css"; // Importación de estilos CSS

const Signup = () => { // Definición del componente Signup
    const { store, actions } = useContext(Context); // Obtención del estado global y las acciones desde el contexto
    const { dataUser } = store; // Obtener dataUser del estado global
    const navigate = useNavigate(); // Obtener la función navigate de react-router-dom

    const handleButtonSubmit = async (e) => { // Función para manejar el envío del formulario
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        try {
            await actions.buttonSubmit(); // Llamada a la acción buttonSubmit para registrar al usuario
            const { creationState } = store; // Accede al estado de creación directamente desde store

            if (creationState[0].message) { // Verifica si el registro fue exitoso
                setTimeout(() => {
                    navigate("/Login"); // Redirige a la página de inicio de sesión después de un tiempo
                }, 3000);
            }
        } catch (error) {
            // console.error("Error:", error);
            // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
        }
    };

    const renderSubmitResponse = () => { // Función para renderizar la respuesta del registro
        const { creationState } = store; // Accede al estado de creación directamente desde store
        if (creationState.length > 0) {
            if (creationState[0].message) { // Verifica si hay un mensaje de éxito
                return (
                    <div className="alert alert-success" role="alert">
                        <p>{creationState[0].message}</p>
                    </div>
                );
            } else { // Si no hay un mensaje de éxito, muestra un mensaje de error
                return (
                    <div className="alert alert-danger" role="alert">
                        <p>{creationState[0].error}</p>
                    </div>
                );
            }
        }
    };

    return (
        <div className={styles.registrationForm}> {/* Contenedor principal del formulario de registro */}
            <h2>Regístrate</h2> {/* Título del formulario */}
            <div>{renderSubmitResponse()}</div> {/* Renderiza la respuesta del registro */}
            <form onSubmit={handleButtonSubmit}> {/* Formulario para enviar la solicitud de registro */}
                {/* Campos de entrada para el registro */}
                <label>
                    Email:
                    <input type="email" name="email" value={dataUser.email.trim()} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Nombre:
                    <input type="text" name="name" value={dataUser.name.trim()} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Apellido:
                    <input type="text" name="last_name" value={dataUser.last_name.trim()} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Tu Nombre de usuario:
                    <input type="text" name="username" value={dataUser.username.trim()} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="password" value={dataUser.password} onChange={actions.handleChangeInput} required title="La contraseña debe tener al menos 8 caracteres alfanuméricos, una mayúscula y un carácter especial (#, @ o *)." />
                </label>
                {/* Preguntas y respuestas de seguridad */}
                <label>
                    Pregunta de seguridad 1:
                    <input type="text" name="security_question_1" value={dataUser.security_questions[0].question} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Respuesta de seguridad 1:
                    <input type="text" name="security_answer_1" value={dataUser.security_questions[0].answer} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Pregunta de seguridad 2:
                    <input type="text" name="security_question_2" value={dataUser.security_questions[1].question} onChange={actions.handleChangeInput} required />
                </label>
                <label>
                    Respuesta de seguridad 2:
                    <input type="text" name="security_answer_2" value={dataUser.security_questions[1].answer} onChange={actions.handleChangeInput} required />
                </label>
                <div className={styles.divButtons}> {/* Div para los botones de acción */}
                    <button type="submit" className={styles.submitButtonSingup}>Registrar</button> {/* Botón para enviar la solicitud de registro */}
                    <Link to="/"> {/* Enlace para cancelar el registro */}
                        <button type="button" className={styles.cancelButton}>Cancelar</button> {/* Botón para cancelar el registro */}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Signup; // Exportación del componente Signup
