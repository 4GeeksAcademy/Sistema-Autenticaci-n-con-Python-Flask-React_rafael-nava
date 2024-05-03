import React, { useState, useEffect, useContext } from "react";
import styles from "./login.module.css";
import { Link} from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const { store, actions } = useContext(Context); // Obtener el estado global (store) y las acciones desde el contexto
  const { loginUser, loginState} = store; // Obtener dataUser del estado global


  const navigate = useNavigate(); // Obtener la función navigate de react-router-dom
  
  const callHandleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

      await actions.handleLogin();
      const { login_true_o_false } = store;
      if (login_true_o_false === true) {
         navigate("/People");
      } 
    };

    const renderLoginResponse = () => {
      if (loginState.length > 0) {
        return (
          <div>
            {loginState.map((data, index) => (
              <div key={index}>
                {data.error ? (
                  <div class="alert alert-danger" role="alert">
                  <p>{data.error}</p>
                </div>
                ) : (
                  <div class="alert alert-success" role="alert">
                    <p>{data.password}</p>
                  </div>    
                )}
              </div>
            ))}
          </div>
        );
      }
    };


    return (
        <div className={styles.loginform}>
          <h2>Inicia sesión</h2>
          <div>
            {renderLoginResponse()}
          </div>
          <form>
            <label>
              Email:
              <input type="email" name="email" value={loginUser.email.trim()} onChange={actions.handleChangeLogin} required/>
            </label>
            <label>
              Contraseña:
              <input type="password" name="password" value={loginUser.password} onChange={actions.handleChangeLogin} required/>
            </label>
            <button type="submit" className={styles.submitButtonLogin} onClick={callHandleLogin}>Iniciar sesión</button>
            <a href="#">¿Olvidaste la contraseña?</a>
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
