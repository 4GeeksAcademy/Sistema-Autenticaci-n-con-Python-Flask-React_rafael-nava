import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; // Importar el contexto desde '../store/appContext'
import { useStore } from "../store/appContext";
import styles from "./Singup.module.css";



const Signup = () => {
  const { store, actions } = useContext(Context); // Obtener el estado global (store) y las acciones desde el contexto
  const { dataUser, creationState } = store; // Obtener dataUser del estado global

  const renderApiResponse = () => {
    if (store.creationState.length > 0) {
      return (
        <div>
          {store.creationState.map((data, index) => (
            <div key={index}>
              {data.error ? (
                <div class="alert alert-danger" role="alert">
                <p>{data.error}</p>
              </div>
              ) : (
                <div class="alert alert-success" role="alert">
                  <p>{data.message}</p>
                </div>    
              )}
            </div>
          ))}
        </div>
      );
    }
  };



  return (
    <div className={styles.registrationForm}>
      <h2>Regístrate</h2>
      <div>
        {renderApiResponse()}
      </div>
      <form onSubmit={actions.handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={dataUser.email.trim()} onChange={actions.handleChange} required />
        </label>
        <label>
          Nombre:
          <input type="text" name="name" value={dataUser.name.trim()} onChange={actions.handleChange} required />
        </label>
        <label>
          Apellido:
          <input type="text" name="last_name" value={dataUser.last_name.trim()} onChange={actions.handleChange} required />
        </label>
        <label>
          Tu Nombre de usuario:
          <input type="text" name="username" value={dataUser.username.trim()} onChange={actions.handleChange} required />
        </label>
        <label>
          Contraseña:
          <input type="password" name="password" value={dataUser.password} onChange={actions.handleChange} required title="La contraseña debe tener al menos 8 caracteres alfanuméricos, una mayúscula y un carácter especial (#, @ o *)." />
        </label>
        <div className={styles.divButtons}>
          <button type="submit" className={styles.submitButtonSingup} onClick={actions.handleSubmit}>
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
