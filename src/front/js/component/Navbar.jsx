import React from "react";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";


const Navbar = () => {
    return (
        <nav className={styles.navbar}>
          <div className={styles.logo}>
          <Link to="/">
            <img src="https://png.pngtree.com/png-vector/20230814/ourmid/pngtree-star-wars-stormtrooper-sticker-vector-png-image_6896914.png" alt="Logo" />
            </Link>
          </div>
          <Link to="/Login">
          <button className={styles.loginButton}>Iniciar sesión</button>
          </Link>
        </nav>
      );
};

export default Navbar;