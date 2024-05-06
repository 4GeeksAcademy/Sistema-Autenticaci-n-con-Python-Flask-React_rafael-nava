import React, { useState, useEffect } from "react"; // Importación de React y algunos hooks
import getState from "./flux.js"; // Importación de la función getState desde flux.js

// No cambies, aquí es donde inicializamos nuestro contexto, por defecto solo será null.
export const Context = React.createContext(null); // Creación del contexto con valor inicial null

// Esta función inyecta el almacenamiento global a cualquier vista/componente donde quieras usarlo, inyectaremos el contexto en layout.js, puedes verlo aquí:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => { // Función que recibe un componente y devuelve un componente envuelto con el contexto
	const StoreWrapper = props => { // Definición del componente StoreWrapper
		// Esto se pasará como el valor del contexto
		const [state, setState] = useState( // Declaración del estado local con hook useState
			getState({ // Llamada a la función getState para obtener el estado inicial
				getStore: () => state.store, // Función para obtener el estado
				getActions: () => state.actions, // Función para obtener las acciones
				setStore: updatedStore => // Función para actualizar el estado
					setState({
						store: Object.assign(state.store, updatedStore), // Actualización del estado del almacenamiento
						actions: { ...state.actions } // Mantenimiento de las acciones
					})
			})
		);

		useEffect(() => { // Efecto que se ejecuta una vez al cargar el componente
			/**
			 * ¡EDITA ESTO!
			 * Esta función es equivalente a "window.onLoad", se ejecuta solo una vez en toda la vida útil de la aplicación.
			 * Debes realizar tus solicitudes ajax o fetch api aquí. No uses setState() para guardar datos en el
			 * almacenamiento, en su lugar usa acciones, como esta:
			 **/
			state.actions.getMessage(); // <---- llamando a esta función desde las acciones de flux.js
		}, []);

		// El valor inicial para el contexto ya no es null, sino el estado actual de este componente,
		// el contexto ahora tendrá disponibles funciones getStore, getActions y setStore, porque fueron declaradas
		// en el estado de este componente
		return (
			<Context.Provider value={state}> {/* Proveedor del contexto con valor del estado */}
				<PassedComponent {...props} /> {/* Renderizado del componente envuelto con el contexto */}
			</Context.Provider>
		);
	};
	return StoreWrapper; // Retorno del componente StoreWrapper
};

export default injectContext; // Exportación de la función injectContext
