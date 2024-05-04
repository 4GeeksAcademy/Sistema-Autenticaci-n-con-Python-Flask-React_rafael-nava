import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; // Importar el contexto desde '../store/appContext'
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import styles from "./Singup.module.css";

const Signup = () => {
  const { store, actions } = useContext(Context); // Obtener el estado global (store) y las acciones desde el contexto
  const { dataUser } = store; // Obtener dataUser del estado global
  const navigate = useNavigate(); // Obtener la función navigate de react-router-dom

  const handleButtonSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
      await actions.buttonSubmit();
      const { creationState } = store; // Accede a login_true_o_false directamente desde store
      // console.log("create successful:", creationState);

      if (creationState[0].message) {
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      }
    } catch (error) {
      // console.error("Error:", error);
      // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const renderSubmitResponse = () => {
    const { creationState } = store; // Accede a login_true_o_false directamente desde store
    if (creationState.length > 0) {
      if (creationState[0].message) {
        return (
          <div class="alert alert-success" role="alert">
            <p>{creationState[0].message}</p>
          </div>
        );
      } else {
        return (
          <div class="alert alert-danger" role="alert">
            <p>{creationState[0].error}</p>
          </div>
        );
      }
    }
  };

  return (
    <div className={styles.registrationForm}>
      <h2>Regístrate</h2>
      <div>{renderSubmitResponse()}</div>
      <form onSubmit={handleButtonSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={dataUser.email.trim()}
            onChange={actions.handleChangeInput}
            required
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={dataUser.name.trim()}
            onChange={actions.handleChangeInput}
            required
          />
        </label>
        <label>
          Apellido:
          <input
            type="text"
            name="last_name"
            value={dataUser.last_name.trim()}
            onChange={actions.handleChangeInput}
            required
          />
        </label>
        <label>
          Tu Nombre de usuario:
          <input
            type="text"
            name="username"
            value={dataUser.username.trim()}
            onChange={actions.handleChangeInput}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={dataUser.password}
            onChange={actions.handleChangeInput}
            required
            title="La contraseña debe tener al menos 8 caracteres alfanuméricos, una mayúscula y un carácter especial (#, @ o *)."
          />
        </label>
        <div className={styles.divButtons}>
          <button
            type="submit"
            className={styles.submitButtonSingup}
          >
            Registrar
          </button>
          <Link to="/">
            <button type="button" className={styles.cancelButton}>
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
