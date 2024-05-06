import React, { useState, useEffect, useContext } from "react";
import styles from "./LoginHelp.module.css";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


const LoginHelp = () => {
  const { store, actions, setStore, getStore } = useContext(Context); // Obtener el estado global (store), las acciones y la función setStore desde el contexto
  const { loginHelpUser, UserPasswordUpdateState} = store; // Obtener dataUser del estado global
  const navigate = useNavigate(); // Obtener la función navigate de react-router-dom

  const [securityData, setSecurityData] = useState({answer1: "", answer2: ""});
  const [showPassword, setShowPassword] = useState(false)


  const callLoginHelp= async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
        await actions.LoginHelp();
        const { loginHelpUser_true_o_false } = store; // Accede a login_true_o_false directamente desde store
        // console.log('Login successful:', loginHelpUser_true_o_false);
        await actions.userDataHelp();
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
    }
    };


    const ChangeAnswerLoginHelp = (e) => {
        // Agregar el detalle de los datos del usuario actualizado
        setSecurityData({...securityData,[e.target.name]: e.target.value});
      };

    const renderQuestions = () => {
        const { loginHelpUser_true_o_false, recoveredUserData} = store; // Accede a login_true_o_false directamente desde store
        if (loginHelpUser_true_o_false) {
            return (
                <form onSubmit={renderPassword}>
                <h4>Preguntas de seguridad</h4>
                  <label>
                  Pregunta 1 {recoveredUserData.security_questions_question1}:
                    <input type="text" name="answer1" value={securityData.answer1.trim()} onChange={ChangeAnswerLoginHelp} required/>
                  </label>
                  <label>
                  Pregunta 2 {recoveredUserData.security_questions_question2}:
                    <input type="text" name="answer2" value={securityData.answer2.trim()} onChange={ChangeAnswerLoginHelp} required/>
                  </label>
                  <button type="submit" className={styles.submitButtonVerify}>Verificar Preguntas</button>
                </form>
            );
          }
          // console.log(securityData)
      };

      const renderPassword = (e) => {
        e.preventDefault();
        const { recoveredUserData } = store;
    
        if (recoveredUserData.security_questions_answer1 !== securityData.answer1) {
            console.log("La respuesta 1 no es correcta");
        } else if (recoveredUserData.security_questions_answer2 !== securityData.answer2) {
            console.log("La respuesta 2 no es correcta");
        } else {
            setShowPassword(true);
        }
    };


    const renderHelpResponse = () => {
      const { loginHelpUserError } = store; // Accede a login_true_o_false directamente desde store
      if (loginHelpUserError.length > 0) {
        if (loginHelpUserError) {
          return (
            <div class="alert alert-danger" role="alert">
              <p>{loginHelpUserError}</p>
            </div>
          );
        }
      }
    };


    const renderNewPassword = () => {
      const { UserPasswordUpdate} = store; // Accede a login_true_o_false directamente desde store
      if (showPassword) {
          return (
            <form onSubmit={HandlChangePassword}>
            <label>
              <h4>Escribe tu nueva contraseña</h4>
              <input type="password" name="password" value={UserPasswordUpdate.password.trim()} onChange={actions.ChangePasswordUpdate} required/>
            </label>
            <button type="submit" className={styles.submitButtonLogin}>Recuperar contraseña</button>
          </form>
          );
        }
        // console.log(securityData)
    };

    const HandlChangePassword = async (e) => {
      e.preventDefault(); // Previene el comportamiento por defecto del formulario
  
      try {
          await actions.userDataHelpChangePassword();
          const { UserPasswordUpdateState } = store; // Accede a login_true_o_false directamente desde store
          console.log("UserPasswordUpdateState:", UserPasswordUpdateState);
          console.log(UserPasswordUpdateState["message"])
            if (UserPasswordUpdateState["message"]){              
              setTimeout(() => {
                navigate("/Login");
              }, 3000);  
           }
      } catch (error) {
          console.error('Error:', error);
          // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
      }
  };

  const renderStatusChange = () => {
    if (UserPasswordUpdateState) {
      if (UserPasswordUpdateState.message) {
        return (
          <div className="alert alert-success" role="alert">
            <h4>Su contraseña ha sido cambiada</h4>
            <p>Se redireccionará a la página principal</p>
          </div>
        );
      } else if (UserPasswordUpdateState.error) {
        return (
          <div className="alert alert-danger" role="alert">
            <h4>{UserPasswordUpdateState.error}</h4>
          </div>
        );
      }
    }
  }
  


  return (
    <div className={styles.loginform}>
      <h2>Recuperar contraseña</h2>
      <div>
      {renderHelpResponse()}
      </div>
      <div>
      {renderStatusChange()}
      </div>
      <form onSubmit={callLoginHelp}>
        <label>
          Email:
          <input type="email" name="email" value={loginHelpUser.email.trim()} onChange={actions.ChangeLoginHelp} required/>
        </label>
        <button type="submit" className={styles.submitButtonLogin}>Recuperar contraseña</button>
      </form>
        <br></br>
        {renderQuestions()}
        <br></br>
        {renderNewPassword()}

    </div>
  );
};

export default LoginHelp;