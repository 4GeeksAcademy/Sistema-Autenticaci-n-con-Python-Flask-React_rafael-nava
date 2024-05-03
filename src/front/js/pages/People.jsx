import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import styles from "./peoples.module.css";



const Peoples = () => {
    const { store, actions } = useContext(Context);

	useEffect(() => {
        // Cargar datos para las categorías principales al montar el componente
        actions.loadDataStartWars();
    }, []);

	return (
        <div className={styles.container}>
          <div className={styles.row}>
          <div className="col-12 d-flex justify-content-between align-items-center">
              <h1 className={styles["text-end"]}>People</h1>
            </div>
            {/* Renderizamos los elementos de la categoría seleccionada */}
            {actions.renderItems()}
          </div>
        </div>
      );
};

export default Peoples;
