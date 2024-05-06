import React, { useState, useEffect, useContext } from "react"; // Importación de React y algunos hooks
import PropTypes from "prop-types"; // Importación de PropTypes para la validación de tipos
import { Link, useParams } from "react-router-dom"; // Importación de Link y useParams para la navegación y obtención de parámetros de la URL
import { Context } from "../store/appContext"; // Importación del contexto
import styles1 from "./character.module.css"; // Importación de estilos CSS

const Character = (props) => { // Definición del componente Character con props
  const { store, actions } = useContext(Context); // Obtención del estado global y las acciones desde el contexto
  const params = useParams(); // Obtención de los parámetros de la URL

  return (
    <div className="d-flex justify-content-center"> {/* Contenedor principal */}
      <div className={styles1["cardSingle"]}> {/* Tarjeta de personaje */}
        <img
          src={`https://starwars-visualguide.com/assets/img/characters/${
            store.people[params.theid].id
          }.jpg`} // Fuente de la imagen del personaje
          className={styles1["card-img-top"]} // Estilo de la imagen
          alt="..." // Texto alternativo para la imagen
          onError={(e) => { // Manejador de eventos para errores de carga de imagen
            // Si hay un error al cargar la imagen, se reemplaza por una imagen de placeholder.
            e.target.src =
              "https://starwars-visualguide.com/assets/img/placeholder.jpg";
          }}
        />
        <div className={styles1["card-bodySingle"]}> {/* Cuerpo de la tarjeta */}
          <div className={styles1["divCard"]}> {/* Div de título */}
            <h2 className={styles1["card-titleSingle"]}>
              {store.people[params.theid].name} {/* Nombre del personaje */}
            </h2>
          </div>
          <div className={styles1["detailCard"]}> {/* Detalles del personaje */}
            {Object.entries(store.people[params.theid]).map( // Mapeo de las propiedades del personaje
              ([key, value]) => (
                <p className={styles1["card-textSingle"]} key={key}> {/* Texto de la tarjeta */}
                  <strong>{key}:</strong> {value || "No especificado"} {/* Mostrar la propiedad y su valor, si no está especificado, mostrar "No especificado" */}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Character; // Exportación del componente Character

Character.propTypes = {
  match: PropTypes.object, // PropType para la coincidencia de ruta
};
