import React, { useState, useEffect, useContext } from "react";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { store, actions, setStore, getStore } = useContext(Context); // Obtener el estado global (store), las acciones y la función setStore desde el contexto
  const { loginUser, login_true_o_false } = store; // Obtener dataUser del estado global
  const navigate = useNavigate(); // Obtener la función navigate de react-router-dom

  const handleCloseSession = async () => {
    await actions.closeSession()
    navigate("/");
    }


  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="https://png.pngtree.com/png-vector/20230814/ourmid/pngtree-star-wars-stormtrooper-sticker-vector-png-image_6896914.png" alt="Logo" />
        </Link>
      </div>
      {/* Mostrar el botón de "Iniciar sesión" si el usuario no ha iniciado sesión */}
      {!login_true_o_false && (
        <Link to="/Login">
          <button className={styles.loginButton}>Iniciar sesión</button>
        </Link>
      )}
      {/* Mostrar el botón de "Cerrar sesión" si el usuario ha iniciado sesión */}
      {login_true_o_false && <button className={styles.logoutButton} onClick={handleCloseSession}>Cerrar sesión</button>}
    </nav>
  );
};

export default Navbar;