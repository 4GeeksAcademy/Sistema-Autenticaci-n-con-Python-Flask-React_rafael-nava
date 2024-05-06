import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import { Link } from "react-router-dom"; // Importación de Link para la navegación
import { Context } from "../store/appContext"; // Importación del contexto
import styles from "./peoples.module.css"; // Importación de estilos CSS

const Peoples = () => { // Definición del componente Peoples
    const { store, actions } = useContext(Context); // Obtención del estado global y las acciones desde el contexto

	useEffect(() => { // Efecto de carga de datos al montar el componente
        // Cargar datos para las categorías principales al montar el componente
        actions.loadDataStartWars();
    }, []);

	return (
        <div className={styles.container}> {/* Contenedor principal */}
          <div className={styles.row}> {/* Fila */}
          <div className="col-12 d-flex justify-content-between align-items-center"> {/* Columna para el título */}
              <h1 className={styles["text-end"]}>People</h1> {/* Título de la página */}
            </div>
            {/* Renderizamos los elementos de la categoría seleccionada */}
            {actions.renderItems()} {/* Renderización de los elementos de la categoría */}
          </div>
        </div>
      );
};

export default Peoples; // Exportación del componente Peoples
