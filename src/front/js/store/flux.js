import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";


const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			dataUser: {
				email: "",
				name: "",
				last_name: "",
				username: "",
				password: ""
			  },

			creationState: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			handleChange: (e) => {				
				// Obtener el estado actualizado del almacén
                const store = getStore();

                // Agregar el detalle de los datos del usuario actualizado
                setStore({...store, dataUser: {...store.dataUser,[e.target.name]: e.target.value}});
				console.log(store)
			  },

			  handleSubmit: async (e, navigate) => {
				const store = getStore();
				const { dataUser, creationState } = store; // Obtener los datos del usuario del estado
				const { email, name, last_name, username, password } = dataUser;

				// Validación del email utilizando una expresión regular
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(email)) {
					console.error("Por favor ingresa un email válido.");
					return;
					}

			    // // Restricciones adicionales para la contraseña (8 caracteres alfanuméricos, una mayúscula y un carácter especial)
				// const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=*])(?=.*[0-9a-zA-Z]).{8,}$/;
				// if (!passwordRegex.test(password)) {
				//   console.error("La contraseña debe tener al menos 8 caracteres alfanuméricos, una mayúscula y un carácter especial (#, @ o *).");
				//   return;
				// }
				
				// Validación de  campos
				if (email.trim() === "" || name.trim() === "" || last_name.trim() === "" || username.trim() === "" || dataUser.password.trim() === "") {
					console.error("Por favor completa todos los campos.");
					return; // Detener el envío del formulario si algún campo está vacío
				}				

				e.preventDefault(); // Prevenir el comportamiento por defecto del formulario, que es enviar una solicitud HTTP

                try {
                    let response = await fetch("https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataUser)
                    });
				    // Si la solicitud es exitosa, limpiar los datos del usuario
					setStore({ ...getStore(), dataUser: { email: "", name: "", last_name: "", username: "", password: "" } });
					
                    let data = await response.json();
					setStore({ ...store, creationState: [...store.creationState, data] });
					
					// Ocultar la respuesta después de 2 segundos
					setTimeout(() => {
						setStore({ ...getStore(), creationState: []});

					}, 2000);

                    console.log(data); // Puedes hacer algo con la respuesta del servidor si es necesario
                } catch (error) {
                    throw new Error(`Error adding user: ${error.message}`);
                }
			}
		}
	};
};

export default getState;
