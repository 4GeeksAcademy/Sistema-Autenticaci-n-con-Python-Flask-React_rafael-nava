import React, { useState, useEffect, useContext } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


const Login = () => {
    return (
        <div className={styles.loginform}>
          <h2>Inicia sesión</h2>
          <form>
            <label>
              Email:
              <input type="email" required/>
            </label>
            <label>
              Contraseña:
              <input type="password" required/>
            </label>
            <button type="submit" className={styles.submitButtonLogin}>Iniciar sesión</button>
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
