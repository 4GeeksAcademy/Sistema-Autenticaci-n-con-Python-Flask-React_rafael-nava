import React, { useState, useEffect, useContext } from "react";
import styles from "./login.module.css";
import { Link} from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const { store, actions, getStore} = useContext(Context); // Obtener el estado global (store) y las acciones desde el contexto
  const { loginUser, loginState} = store; // Obtener dataUser del estado global


  const navigate = useNavigate(); // Obtener la función navigate de react-router-dom
  
  const callHandleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
        await actions.handleLogin();
        const { login_true_o_false } = store; // Accede a login_true_o_false directamente desde store
        // console.log('Login successful:', login_true_o_false);
        await actions.loadDataStartWars();
        // console.log('Data loaded');
        
        if (login_true_o_false){
            // console.log('Navigating to /People');
            navigate("/People");
        }

    } catch (error) {
        console.error('Error:', error);
        // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
    }
};

    const renderLoginResponse = () => {
      const { loginState } = store; // Accede a login_true_o_false directamente desde store
      if (loginState.length > 0) {
        if (loginState[0].error) {
          return (
            <div className="alert alert-danger" role="alert">
              <p>{loginState[0].error}</p>
            </div>
          );
        } else {
          return (
            <div className="alert alert-success" role="alert">
              <p>Correct password</p>
            </div>
          );
        }
      }
    };


    return (
        <div className={styles.loginform}>
          <h2>Inicia sesión</h2>
          <div>
            {renderLoginResponse()}
          </div>
          <form onSubmit={callHandleLogin}>
            <label>
              Email:
              <input type="email" name="email" value={loginUser.email.trim()} onChange={actions.handleChangeLogin} required/>
            </label>
            <label>
              Contraseña:
              <input type="password" name="password" value={loginUser.password} onChange={actions.handleChangeLogin} required/>
            </label>
            <button type="submit" className={styles.submitButtonLogin}>Iniciar sesión</button>
            <Link to="/LoginHelp">¿Olvidaste la contraseña?</Link>
            <div className="rememberMe">
              <input type="checkbox" />
              <span>Recuérdame</span>
              <p>¿Es tu primera vez aca? <Link to="/Singup">Registrate ahora.</Link></p>
            </div>
          </form>
        </div>
      );
};

export default Login;
