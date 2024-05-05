import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "../pages/peoples.module.css";
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
        security_questions: [
          { question: "", answer: "" },
          { question: "", answer: "" }
        ]
      },

      creationState: [],
      loginState: [],
      people: [],
      loginUser: { email: "", password: "" },
      login_true_o_false: false,
      loginHelpUser:{ email: "" },
      loginHelpUserError:[],
      loginHelpUser_true_o_false: false,
      loginHelpState: false,
      recoveredUserData: [],
      UserPasswordUpdate:{ password: "" },
      UserPasswordUpdateState: []


    },

    actions: {
      getMessage: async () => {
        try {
          // fetching data from the backend
          // const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },

      handleChangeInput: (e) => {
        // Obtener el estado actualizado del almacén
        const store = getStore();
      
        // Extraer el nombre y el valor del campo del evento
        const { name, value } = e.target;
      
        // Verificar si el campo es una pregunta o respuesta de seguridad
        if (name.startsWith("security_question_")) {
          // Obtener el número de la pregunta de seguridad
          const questionNumber = parseInt(name.charAt(name.length - 1));
      
          // Actualizar la pregunta de seguridad correspondiente en el estado
          const updatedSecurityQuestions = [...store.dataUser.security_questions];
          updatedSecurityQuestions[questionNumber - 1].question = value;
      
          // Actualizar el estado solo para las preguntas de seguridad
          setStore({
            ...store,
            dataUser: {
              ...store.dataUser,
              security_questions: updatedSecurityQuestions
            }
          });
        } else if (name.startsWith("security_answer_")) {
          // Obtener el número de la respuesta de seguridad
          const answerNumber = parseInt(name.charAt(name.length - 1));
      
          // Actualizar la respuesta de seguridad correspondiente en el estado
          const updatedSecurityQuestions = [...store.dataUser.security_questions];
          updatedSecurityQuestions[answerNumber - 1].answer = value;
      
          // Actualizar el estado solo para las respuestas de seguridad
          setStore({
            ...store,
            dataUser: {
              ...store.dataUser,
              security_questions: updatedSecurityQuestions
            }
          });
        } else {
          // Si no es una pregunta o respuesta de seguridad, actualizar el estado como antes
          setStore({
            ...store,
            dataUser: {
              ...store.dataUser,
              [name]: value
            }
          });
        }
        console.log(store);
      },
      

      buttonSubmit: async () => {
        const store = getStore();
        const { dataUser, creationState } = store; // Obtener los datos del usuario del estado
        const { email, name, last_name, username, password, security_questions } = dataUser;

        // Validación del email utilizando una expresión regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          // console.error("Por favor ingresa un email válido.");
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
          dataUser.password.trim() === "" ||
          security_questions.length !== 2 // Verifica que se proporcionen dos preguntas y respuestas de seguridad
  
        ) {
          console.error("Por favor completa todos los campos.");
          return; // Detener el envío del formulario si algún campo está vacío
        }


        try {
          const userData = {
            email, name,last_name, 
            username, password, security_questions};
          let response = await fetch(
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/users",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          setStore({
            ...getStore(),
            dataUser: {
              email: "",
              name: "",
              last_name: "",
              username: "",
              password: "",
              security_questions: [
                { question: "", answer: "" }, // Reiniciar las preguntas y respuestas de seguridad
                { question: "", answer: "" }
              ]
            },
          });

          let data = await response.json();
          setStore({ ...store, creationState: [...store.creationState, data] });
          // console.log("creationState: ",store.creationState)
          // Ocultar la respuesta después de 3 segundos
          setTimeout(() => {
            setStore({ ...getStore(), creationState: [] });
          }, 3000);

          // console.log(data); // Puedes hacer algo con la respuesta del servidor si es necesario
        } catch (error) {
          throw new Error(`Error adding user: ${error.message}`);
        }
      },

      handleChangeLogin: (e) => {
        // Obtener el estado actualizado del almacén
        const store = getStore();

        // Agregar el detalle de los datos del usuario actualizado
        setStore({
          ...store,
          loginUser: { ...store.loginUser, [e.target.name]: e.target.value },
        });
        // console.log(store);
      },

      handleLogin: async () => {
        const store = getStore();
        const { loginUser } = store; // Obtener los datos del usuario del estado
        const { email, password } = loginUser;

        if (email.trim() === "" || password.trim() === "") {
          console.error("Por favor completa todos los campos.");
          return; // Detener el envío del formulario si algún campo está vacío
        }

        try {
          let response = await fetch(
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginUser),
            }
          );

          let data = await response.json();
          if(data.access_token){
            localStorage.setItem("token", data.access_token);
          }

          setStore({ ...store, login_true_o_false: data.login });
          setStore({ ...store, loginState: [...store.loginState, data] });
          // console.log(store)

          // Ocultar la respuesta después de 2 segundos
          setTimeout(() => {
            setStore({ ...getStore(), loginState: [] });
          }, 3000);
        } catch (error) {
          throw new Error(`Error login: ${error.message}`);
        }
      },


      ChangeLoginHelp: (e) => {
        // Obtener el estado actualizado del almacén
        const store = getStore();

        // Agregar el detalle de los datos del usuario actualizado
        setStore({
          ...store,
          loginHelpUser: { ...store.loginHelpUser, [e.target.name]: e.target.value },
        });
        // console.log(store);
      },

      LoginHelp: async () => {
        const store = getStore();
        const { loginHelpUser } = store; // Obtener los datos del usuario del estado
        const { email } = loginHelpUser;

        if (email.trim() === "") {
          console.error("Por favor completa todos los campos.");
          return; // Detener el envío del formulario si algún campo está vacío
        }

        try {
          let response = await fetch(
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/tokenLoginHelp",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginHelpUser),
            }
          );

          let data = await response.json();
          console.log(data);
          if(data.access_token){
            localStorage.setItem("tokenhelp", data.access_token);
          }

          setStore({ ...store, loginHelpUser_true_o_false: data.login });
          
          if(data.error){
          setStore({ ...store, loginHelpUserError: data.error });}
          // setStore({ ...store, loginState: [...store.loginState, data] });
          console.log(store)

          // Ocultar la respuesta después de 2 segundos
          setTimeout(() => {
            setStore({ ...getStore(), loginHelpUserError: [] });
          }, 1500);

        } catch (error) {
          console.error(error)
          throw new Error(`Error login: ${error.message}`);
        }
      },

      userDataHelp: async () => {
        try {
          // Obtenemos el token del almacenamiento local
          let myToken = localStorage.getItem("tokenhelp");
          // Construimos la URL para la solicitud
          let url =
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/user";
          // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
          let response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${myToken}`
            },
          });
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
          setStore({ ...store, recoveredUserData: data });
          // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
          console.log("Store after data loaded:", store);
        } catch (error) {
          console.error(error)
          // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
          console.error(error.message);
        }
      },


      ChangePasswordUpdate: (e) => {
        // Obtener el estado actualizado del almacén
        const store = getStore();

        // Agregar el detalle de los datos del usuario actualizado
        setStore({
          ...store,
          UserPasswordUpdate: { ...store.UserPasswordUpdate, [e.target.name]: e.target.value },
        });
        // console.log(store);
      },

      userDataHelpChangePassword: async () => {
        const store = getStore();
        const { UserPasswordUpdate } = store; // Obtener los datos del usuario del estado
        const { password } = UserPasswordUpdate;
        console.log(store)

        if (password.trim() === "") {
          console.error("Por favor completa todos los campos.");
          return; // Detener el envío del formulario si algún campo está vacío
        }

        try {
          // Obtenemos el token del almacenamiento local
          let myToken = localStorage.getItem("tokenhelp");
          // Construimos la URL para la solicitud
          let url =
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/user";
          // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
          let response = await fetch(url, {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${myToken}`,
            "Content-Type": "application/json"},
            body: JSON.stringify(UserPasswordUpdate),
          });
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
          setStore({ ...store, UserPasswordUpdateState: data });
          // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
          console.log("Store after data loaded:", store);
        } catch (error) {
          setStore({ ...store, UserPasswordUpdateState: error });
          // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
          console.error(error);
        }
      },

      loadDataStartWars: async () => {
        try {
          // Obtenemos el token del almacenamiento local
          let myToken = localStorage.getItem("token");
          // Construimos la URL para la solicitud
          let url =
            "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/people";
          // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
          let response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${myToken}`
            },
          });
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
          // console.log("Store after data loaded:", store);
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
          <div className={styles["cardDemo"]} key={index}>
            <Link to={"/Character/" + index}>
              <img
                src={`https://starwars-visualguide.com/assets/img/characters/${item.id}.jpg`}
                className={styles["card-img-top"]}
                alt={`Image for ${item.name}`}
                onError={(e) => {
                  e.target.src =
                    "https://starwars-visualguide.com/assets/img/placeholder.jpg";
                }}
              />
            </Link>
            <div className={styles["card-bodyDemo"]}>
              <h5 className={styles["card-titleDemo"]}>
                <Link to={"/Character/" + index}>
                  {item.name || "Título no disponible"}
                </Link>
              </h5>
            </div>
          </div>
        ));
      },

      closeSession: () => {
        const store = getStore();
        const { loginUser, login_true_o_false, dataUser } = store; // Obtener dataUser del estado global

        // Verificar si el usuario ha iniciado sesión
        if (login_true_o_false === 'Password correct') {
          // Eliminar la información de inicio de sesión del almacenamiento local
          setStore({
            ...getStore(),
            people: [],
            loginUser: { email: "", password: "" },
            login_true_o_false: false,
            dataUser: {
              email: "",
              name: "",
              last_name: "",
              username: "",
              password: "",
            },
          });
          console.log(store);
        }
      },
    },
  };
};

export default getState;
