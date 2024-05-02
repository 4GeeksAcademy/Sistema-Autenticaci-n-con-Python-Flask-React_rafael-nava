import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import styles from "./character.module.css";

const Character = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  return (
      <div className="d-flex justify-content-center">
        <div className="cardSingle" style={{ width: "18rem" }}>
          {/* // se llama a la funcion para extraer imagen y se pasa como argumento itemDetail */}
          <img
            src={`https://starwars-visualguide.com/assets/img/characters/${
              store.people[params.theid].id
            }.jpg`}
            className="card-img-top"
            alt="..."
            onError={(e) => {
              // Si hay un error al cargar la imagen, se reemplaza por una imagen de placeholder.
              e.target.src =
                "https://starwars-visualguide.com/assets/img/placeholder.jpg";
            }}
          />
          <div className="card-bodySingle">
            <div className="divCard">
              <h2 className="card-titleSingle">
                {store.people[params.theid].name}
              </h2>
            </div>
            <div className="detailCard">
              {Object.entries(store.people[params.theid]).map(
                ([key, value]) => (
                  <p className="card-textSingle" key={key}>
                    <strong>{key}:</strong> {value || "No especificado"}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Character;

Character.propTypes = {
  match: PropTypes.object,
};