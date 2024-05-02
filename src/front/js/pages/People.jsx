import React, { useState, useEffect, useContext } from "react";
import styles from "./peoples.module.css";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


const Peoples = () => {
    const { store, actions } = useContext(Context);

	useEffect(() => {
        // Cargar datos para las categorías principales al montar el componente
        actions.loadDataStartWars();
    }, []);

	return (
        <div className="container">
            <div className="row">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    {/* Título de la categoría seleccionada */}
                    <h1 className="text-end">People</h1>
                    {/* Botones para cargar la página anterior y siguiente */}
                    <div className="buttonsPag">
                    </div>
                </div>
                {/* Renderizamos los elementos de la categoría seleccionada */}
                {actions.renderItems()}
            </div>
        </div>
    );
};

export default Peoples;
