import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// import { useNavigate } from "react-router";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      dataUser: {
        email: "",
        name: "",
        last_name: "",
        username: "",
        password: "",
      },

      creationState: [],
      people: [],
    },
    
    actions: {

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },

      handleChange: (e) => {
        // Obtener el estado actualizado del almacén
        const store = getStore();

        // Agregar el detalle de los datos del usuario actualizado
        setStore({
          ...store,
          dataUser: { ...store.dataUser, [e.target.name]: e.target.value },
        });
        console.log(store);
      },

      handleSubmit: async (e) => {
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
        if (
          email.trim() === "" ||
          name.trim() === "" ||
          last_name.trim() === "" ||
          username.trim() === "" ||
          dataUser.password.trim() === ""
        ) {
          console.error("Por favor completa todos los campos.");
          return; // Detener el envío del formulario si algún campo está vacío
        }

        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario, que es enviar una solicitud HTTP

        try {
          let response = await fetch(
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/users",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataUser),
            }
          );
          // Si la solicitud es exitosa, limpiar los datos del usuario
          setStore({
            ...getStore(),
            dataUser: {
              email: "",
              name: "",
              last_name: "",
              username: "",
              password: "",
            },
          });

          let data = await response.json();
          setStore({ ...store, creationState: [...store.creationState, data] });

          // Ocultar la respuesta después de 2 segundos
          setTimeout(() => {
            setStore({ ...getStore(), creationState: [] });
          }, 2000);

          console.log(data); // Puedes hacer algo con la respuesta del servidor si es necesario
        } catch (error) {
          throw new Error(`Error adding user: ${error.message}`);
        }
      },

      loadDataStartWars: async () => {
        try {
          // Construimos la URL para la solicitud según la categoría proporcionada, si no se proporciona una URL específica
          let url = `https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/characters`;

          // Realizamos una solicitud a la URL construida usando fetch
          let response = await fetch(url);

          // Verificamos si la respuesta de la solicitud es exitosa (status code 200-299)
          if (!response.ok) {
            // Si la respuesta no es exitosa, lanzamos un error con un mensaje apropiado
            throw new Error(
              `No se pudieron recuperar los datos: ${response.statusText}`
            );
          }
          // Convertimos la respuesta a formato JSON para extraer los datos
          let data = await response.json();
          // Si categoryDetail y pageUrl no están definidos, actualizamos el estado de la tienda directamente con los datos cargados
          let store = getStore();
          setStore({ ...store, people: data });
          // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
          console.log("Store after data loaded:", store);
        } catch (error) {
          // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
          console.error(error.message);
        }
      },

      renderItems: () => {
        const store = getStore();
        const { people } = store; // Obtener los datos del usuario del estado

        // Mapeamos los resultados y creamos las tarjetas correspondientes
        return people.map((item, index) => (
          <div
            className="cardDemo"
          >
            <Link to={"/Single/" + index}>
              <img
                src={`https://starwars-visualguide.com/assets/img/characters/${item.id}.jpg`}
                // La URL de la imagen se construye dinámicamente.
                // Si la categoría es 'people', se usa 'characters' en lugar de 'people' en la URL.
                // De lo contrario, se usa la categoría actual.
                className="card-img-top"
                alt={`Image for ${item.name}`}
                // Texto alternativo para la imagen que incluye el nombre del item.
                onError={(e) => {
                  // Si hay un error al cargar la imagen, se reemplaza por una imagen de placeholder.
                  e.target.src =
                    "https://starwars-visualguide.com/assets/img/placeholder.jpg";
                }}
              /></Link>
            <div className="card-bodyDemo">
              <h5 className="card-titleDemo">
                <Link to={"/Single/" + index}>{item.name || "Título no disponible"}</Link>
              </h5>
            </div>
          </div>
        ));
      },

    },
  };
};

export default getState;
