import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import styles1 from "./character.module.css";

const Character = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  return (
      <div className="d-flex justify-content-center"> 
        <div className={styles1["cardSingle"]}>
          <img
            src={`https://starwars-visualguide.com/assets/img/characters/${
              store.people[params.theid].id
            }.jpg`}
            className={styles1["card-img-top"]}
            alt="..."
            onError={(e) => {
              // Si hay un error al cargar la imagen, se reemplaza por una imagen de placeholder.
              e.target.src =
                "https://starwars-visualguide.com/assets/img/placeholder.jpg";
            }}
          />
          <div className={styles1["card-bodySingle"]}>
            <div className={styles1["divCard"]}>
              <h2 className={styles1["card-titleSingle"]}>
                {store.people[params.theid].name}
              </h2>
            </div>
            <div className={styles1["detailCard"]}>
              {Object.entries(store.people[params.theid]).map(
                ([key, value]) => (
                  <p className={styles1["card-textSingle"]} key={key}>
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