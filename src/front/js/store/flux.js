import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "../pages/peoples.module.css";
// import { useNavigate } from "react-router";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      dataUser: { // Objeto que almacena los datos del usuario
        email: "", // Correo electrónico del usuario (inicializado como cadena vacía)
        name: "", // Nombre del usuario (inicializado como cadena vacía)
        last_name: "", // Apellido del usuario (inicializado como cadena vacía)
        username: "", // Nombre de usuario del usuario (inicializado como cadena vacía)
        password: "", // Contraseña del usuario (inicializada como cadena vacía)
        security_questions: [ // Array que almacena las preguntas y respuestas de seguridad del usuario
            { question: "", answer: "" }, // Pregunta y respuesta de seguridad 1 (ambos inicializados como cadena vacía)
            { question: "", answer: "" } // Pregunta y respuesta de seguridad 2 (ambos inicializados como cadena vacía)
        ]
      },
      creationState: [], // Array que almacena el estado de la creación de usuarios
      loginState: [], // Array que almacena el estado del inicio de sesión
      people: [], // Array que almacena los datos de los personajes de Star Wars
      loginUser: { email: "", password: "" }, // Objeto que almacena la información de inicio de sesión del usuario (correo electrónico y contraseña, ambos inicializados como cadena vacía)
      login_true_o_false: false, // Booleano que indica si el usuario ha iniciado sesión correctamente (false inicialmente)
      loginHelpUser:{ email: "" }, // Objeto que almacena el correo electrónico proporcionado para la ayuda de inicio de sesión (inicializado como cadena vacía)
      loginHelpUserError:[], // Array que almacena los errores relacionados con la ayuda de inicio de sesión
      loginHelpUser_true_o_false: false, // Booleano que indica si la ayuda de inicio de sesión fue exitosa (false inicialmente)
      loginHelpState: false, // Booleano que almacena el estado de la ayuda de inicio de sesión (false inicialmente)
      recoveredUserData: [], // Array que almacena los datos recuperados del usuario
      UserPasswordUpdate:{ password: "" }, // Objeto que almacena la nueva contraseña proporcionada por el usuario para actualizarla (inicializada como cadena vacía)
      UserPasswordUpdateState: [] // Array que almacena el estado de la actualización de la contraseña

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

      handleChangeInput: (e) => { // Se define una función llamada handleChangeInput que toma un evento como argumento
        // Obtener el estado actualizado del almacén
        const store = getStore(); // Se obtiene el estado actual del almacén utilizando la función getStore()
    
        // Extraer el nombre y el valor del campo del evento
        const { name, value } = e.target; // Se extraen el nombre y el valor del campo del evento del input que causó el cambio
    
        // Verificar si el campo es una pregunta o respuesta de seguridad
        if (name.startsWith("security_question_")) { // Se verifica si el nombre del campo comienza con "security_question_"
            // Obtener el número de la pregunta de seguridad
            const questionNumber = parseInt(name.charAt(name.length - 1)); // Se obtiene el número de la pregunta de seguridad de la parte final del nombre del campo
    
            // Actualizar la pregunta de seguridad correspondiente en el estado
            const updatedSecurityQuestions = [...store.dataUser.security_questions]; // Se crea una copia de las preguntas de seguridad del estado actual
            updatedSecurityQuestions[questionNumber - 1].question = value; // Se actualiza la pregunta de seguridad correspondiente con el nuevo valor
    
            // Actualizar el estado solo para las preguntas de seguridad
            setStore({ // Se actualiza el estado utilizando la función setStore()
                ...store, // Se mantiene el resto del estado sin cambios
                dataUser: { // Se actualiza la parte del estado relacionada con el usuario
                    ...store.dataUser, // Se mantiene el resto de los datos del usuario sin cambios
                    security_questions: updatedSecurityQuestions // Se actualizan las preguntas de seguridad con la nueva lista actualizada
                }
            });
        } else if (name.startsWith("security_answer_")) { // Si el campo es una respuesta de seguridad
            // Obtener el número de la respuesta de seguridad
            const answerNumber = parseInt(name.charAt(name.length - 1)); // Se obtiene el número de la respuesta de seguridad de la parte final del nombre del campo
    
            // Actualizar la respuesta de seguridad correspondiente en el estado
            const updatedSecurityQuestions = [...store.dataUser.security_questions]; // Se crea una copia de las respuestas de seguridad del estado actual
            updatedSecurityQuestions[answerNumber - 1].answer = value; // Se actualiza la respuesta de seguridad correspondiente con el nuevo valor
    
            // Actualizar el estado solo para las respuestas de seguridad
            setStore({ // Se actualiza el estado utilizando la función setStore()
                ...store, // Se mantiene el resto del estado sin cambios
                dataUser: { // Se actualiza la parte del estado relacionada con el usuario
                    ...store.dataUser, // Se mantiene el resto de los datos del usuario sin cambios
                    security_questions: updatedSecurityQuestions // Se actualizan las respuestas de seguridad con la nueva lista actualizada
                }
            });
        } else { // Si no es una pregunta o respuesta de seguridad
            // Si no es una pregunta o respuesta de seguridad, actualizar el estado como antes
            setStore({ // Se actualiza el estado utilizando la función setStore()
                ...store, // Se mantiene el resto del estado sin cambios
                dataUser: { // Se actualiza la parte del estado relacionada con el usuario
                    ...store.dataUser, // Se mantiene el resto de los datos del usuario sin cambios
                    [name]: value // Se actualiza el campo específico con el nuevo valor
                }
            });
        }
        // console.log(store); // Se imprime el estado actualizado en la consola para propósitos de depuración
      },
    
      buttonSubmit: async () => { // Se define una función llamada buttonSubmit que se ejecutará al hacer clic en el botón de enviar
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Obtener los datos del usuario del estado
        const { dataUser } = store;
        const { email, name, last_name, username, password, security_questions } = dataUser;
    
        // Validación del email utilizando una expresión regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Se define una expresión regular para validar el formato del email
        if (!emailRegex.test(email)) { // Se verifica si el email cumple con el formato esperado
            // console.error("Por favor ingresa un email válido.");
            return; // Se detiene el proceso si el email no es válido
        }
    
        // // Restricciones adicionales para la contraseña (8 caracteres alfanuméricos, una mayúscula y un carácter especial)
        // const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=*])(?=.*[0-9a-zA-Z]).{8,}$/; // Se define una expresión regular para validar la contraseña
        // if (!passwordRegex.test(password)) { // Se verifica si la contraseña cumple con los requisitos
        //     console.error("La contraseña debe tener al menos 8 caracteres alfanuméricos, una mayúscula y un carácter especial (#, @ o *).");
        //     return; // Se detiene el proceso si la contraseña no cumple con los requisitos
        // }
    
        // Validación de campos
        if (
            email.trim() === "" || // Verifica si el campo de email está vacío
            name.trim() === "" || // Verifica si el campo de nombre está vacío
            last_name.trim() === "" || // Verifica si el campo de apellido está vacío
            username.trim() === "" || // Verifica si el campo de nombre de usuario está vacío
            dataUser.password.trim() === "" || // Verifica si el campo de contraseña está vacío
            security_questions.length !== 2 // Verifica que se proporcionen dos preguntas y respuestas de seguridad
        ) {
            // console.error("Por favor completa todos los campos.");
            return; // Se detiene el proceso si algún campo está vacío
        }
    
        try {
            const userData = { // Se crea un objeto con los datos del usuario
                email, name, last_name, username, password, security_questions
            };
            let response = await fetch( // Se envía una solicitud POST al servidor con los datos del usuario
                "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/users", // URL del servidor
                {
                    method: "POST", // Método de la solicitud
                    headers: {
                        "Content-Type": "application/json", // Tipo de contenido de la solicitud
                    },
                    body: JSON.stringify(userData), // Datos del usuario convertidos a formato JSON y enviados en el cuerpo de la solicitud
                }
            );
    
            // Se actualiza el estado después de enviar los datos
            setStore({
                ...getStore(), // Se mantiene el resto del estado sin cambios
                dataUser: { // Se actualiza la parte del estado relacionada con los datos del usuario
                    email: "", // Se reinicia el campo de email
                    name: "", // Se reinicia el campo de nombre
                    last_name: "", // Se reinicia el campo de apellido
                    username: "", // Se reinicia el campo de nombre de usuario
                    password: "", // Se reinicia el campo de contraseña
                    security_questions: [ // Se reinician las preguntas y respuestas de seguridad
                        { question: "", answer: "" }, // Se reinicia la primera pregunta y respuesta de seguridad
                        { question: "", answer: "" } // Se reinicia la segunda pregunta y respuesta de seguridad
                    ]
                },
            });
    
            let data = await response.json(); // Se espera la respuesta del servidor en formato JSON
            setStore({ ...store, creationState: [...store.creationState, data] }); // Se actualiza el estado con la nueva respuesta del servidor
    
            // Ocultar la respuesta después de 3 segundos
            setTimeout(() => {
                setStore({ ...getStore(), creationState: [] }); // Se reinicia el estado relacionado con la respuesta después de 3 segundos
            }, 3000);
    
            // console.log(data); // Puedes hacer algo con la respuesta del servidor si es necesario
        } catch (error) {
            throw new Error(`Error adding user: ${error.message}`); // Se maneja cualquier error que ocurra durante el proceso de envío de datos
        }
      },
  

      handleChangeLogin: (e) => { // Se define una función llamada handleChangeLogin que se ejecutará cuando haya un cambio en un input de inicio de sesión
      // Obtener el estado actualizado del almacén
      const store = getStore(); // Se obtiene el estado actual del almacén

      // Agregar el detalle de los datos del usuario actualizado
      setStore({ // Se actualiza el estado utilizando la función setStore()
          ...store, // Se mantiene el resto del estado sin cambios
          loginUser: { // Se actualiza la parte del estado relacionada con el inicio de sesión del usuario
              ...store.loginUser, // Se mantiene el resto de los datos del inicio de sesión sin cambios
              [e.target.name]: e.target.value // Se actualiza el campo específico con el nuevo valor obtenido del input que causó el cambio
          },
      });
      // console.log(store); // Se puede imprimir el estado actualizado en la consola para propósitos de depuración
      },


      handleLogin: async () => { // Se define una función llamada handleLogin que se ejecutará al iniciar sesión
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Obtener los datos del usuario del estado
        const { loginUser } = store;
        const { email, password } = loginUser;
    
        if (email.trim() === "" || password.trim() === "") { // Verifica si el campo de email o contraseña están vacíos
            // console.error("Por favor completa todos los campos.");
            return; // Detener el proceso si algún campo está vacío
        }
    
        try {
            let response = await fetch( // Se envía una solicitud POST al servidor para iniciar sesión
                "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/token", // URL del servidor
                {
                    method: "POST", // Método de la solicitud
                    headers: {
                        "Content-Type": "application/json", // Tipo de contenido de la solicitud
                    },
                    body: JSON.stringify(loginUser), // Datos del usuario convertidos a formato JSON y enviados en el cuerpo de la solicitud
                }
            );
    
            let data = await response.json(); // Se espera la respuesta del servidor en formato JSON
            if(data.access_token){ // Si se recibe un token de acceso en la respuesta
                localStorage.setItem("token", data.access_token); // Se guarda el token de acceso en el almacenamiento local del navegador
            }
    
            // Se actualiza el estado con los datos recibidos del servidor
            setStore({ ...store, login_true_o_false: data.login });
            setStore({ ...store, loginState: [...store.loginState, data] });
    
            // Ocultar la respuesta después de 3 segundos
            setTimeout(() => {
                setStore({ ...getStore(), loginState: [] }); // Se reinicia el estado relacionado con la respuesta después de 3 segundos
            }, 3000);
        } catch (error) {
            // console.error(error);
            throw new Error(`Error login: ${error.message}`); // Se maneja cualquier error que ocurra durante el proceso de inicio de sesión
        }
      },

      loadUserData: async () => { // Se define una función llamada userDataHelp que se ejecutará para obtener datos de usuario con ayuda del token
        try {
            // Obtenemos el token del almacenamiento local
            let myToken = localStorage.getItem("token");
    
            // Construimos la URL para la solicitud
            let url = "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/user";
    
            // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
            let response = await fetch(url, {
                method: "GET", // Método de la solicitud
                headers: {
                    Authorization: `Bearer ${myToken}`
                    // Se incluye el token de autorización en los encabezados concatenamos con el nombre del tipo de token "BearerToken"
                },
            });
    
            // Verificamos si la respuesta de la solicitud es exitosa (status code 200-299)
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzamos un error con un mensaje apropiado
                throw new Error(`No se pudieron recuperar los datos: ${response.statusText}`);
            }
    
            // Convertimos la respuesta a formato JSON para extraer los datos
            let data = await response.json();
            // console.log(data)
            // Si categoryDetail y pageUrl no están definidos, actualizamos el estado de la tienda directamente con los datos cargados
            let store = getStore(); // Se obtiene el estado actual del almacén
            setStore({ ...store, recoveredUserData: data }); // Se actualiza el estado con los datos de usuario recuperados
    
            // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
            // console.log("Store after data loaded:", store);
        } catch (error) {
            console.error(error); // Se imprime cualquier error que ocurra durante el proceso
            // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
        }
      },
    
      ChangeLoginHelp: (e) => { // Se define una función llamada ChangeLoginHelp que se ejecutará cuando haya un cambio en un input relacionado con la ayuda de inicio de sesión
        // Obtener el estado actualizado del almacén
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Agregar el detalle de los datos del usuario actualizado
        setStore({ // Se actualiza el estado utilizando la función setStore()
            ...store, // Se mantiene el resto del estado sin cambios
            loginHelpUser: { // Se actualiza la parte del estado relacionada con la ayuda de inicio de sesión del usuario
                ...store.loginHelpUser, // Se mantiene el resto de los datos de la ayuda de inicio de sesión sin cambios
                [e.target.name]: e.target.value // Se actualiza el campo específico con el nuevo valor obtenido del input que causó el cambio
            },
        });
        // console.log(store); // Se puede imprimir el estado actualizado en la consola para propósitos de depuración
      },
    

      LoginHelp: async () => { // Se define una función llamada LoginHelp que se ejecutará cuando se solicite ayuda para iniciar sesión
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Obtener los datos del usuario del estado
        const { loginHelpUser } = store;
        const { email } = loginHelpUser;
    
        if (email.trim() === "") { // Verifica si el campo de email está vacío
            // console.error("Por favor completa todos los campos.");
            return; // Detener el proceso si el campo de email está vacío
        }
    
        try {
            let response = await fetch( // Se envía una solicitud POST al servidor para solicitar ayuda para iniciar sesión
                "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/tokenLoginHelp", // URL del servidor
                {
                    method: "POST", // Método de la solicitud
                    headers: {
                        "Content-Type": "application/json", // Tipo de contenido de la solicitud
                    },
                    body: JSON.stringify(loginHelpUser), // Datos del usuario convertidos a formato JSON y enviados en el cuerpo de la solicitud
                }
            );
    
            let data = await response.json(); // Se espera la respuesta del servidor en formato JSON
            // console.log(data); // Se imprime la respuesta del servidor en la consola
    
            if(data.access_token){ // Si se recibe un token de acceso en la respuesta
                localStorage.setItem("tokenhelp", data.access_token); // Se guarda el token de acceso en el almacenamiento local del navegador
            }
    
            // Se actualiza el estado con los datos recibidos del servidor
            setStore({ ...store, loginHelpUser_true_o_false: data.login });
            
            if(data.error){ // Si se recibe un error en la respuesta
                setStore({ ...store, loginHelpUserError: data.error }); // Se guarda el error en el estado
            }
    
            // Ocultar el error después de 1.5 segundos
            setTimeout(() => {
                setStore({ ...getStore(), loginHelpUserError: [] }); // Se reinicia el estado relacionado con el error después de 1.5 segundos
            }, 1500);
    
        } catch (error) {
            console.error(error); // Se imprime cualquier error que ocurra durante el proceso
            throw new Error(`Error login: ${error.message}`); // Se maneja cualquier error que ocurra durante el proceso de inicio de sesión
        }
      },
    
      userDataHelp: async () => { // Se define una función llamada userDataHelp que se ejecutará para obtener datos de usuario con ayuda del token
        try {
            // Obtenemos el token del almacenamiento local
            let myToken = localStorage.getItem("tokenhelp");
    
            // Construimos la URL para la solicitud
            let url = "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/user";
    
            // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
            let response = await fetch(url, {
                method: "GET", // Método de la solicitud
                headers: {
                    Authorization: `Bearer ${myToken}`
                    // Se incluye el token de autorización en los encabezados concatenamos con el nombre del tipo de token "BearerToken"
                },
            });
    
            // Verificamos si la respuesta de la solicitud es exitosa (status code 200-299)
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzamos un error con un mensaje apropiado
                throw new Error(`No se pudieron recuperar los datos: ${response.statusText}`);
            }
    
            // Convertimos la respuesta a formato JSON para extraer los datos
            let data = await response.json();
    
            // Si categoryDetail y pageUrl no están definidos, actualizamos el estado de la tienda directamente con los datos cargados
            let store = getStore(); // Se obtiene el estado actual del almacén
            setStore({ ...store, recoveredUserData: data }); // Se actualiza el estado con los datos de usuario recuperados
    
            // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
            // console.log("Store after data loaded:", store);
        } catch (error) {
            console.error(error); // Se imprime cualquier error que ocurra durante el proceso
            // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
        }
      },
    
      ChangePasswordUpdate: (e) => { // Se define una función llamada hangePasswordUpdate que se ejecutará cuando haya un cambio en un input relacionado con la actualización de contraseña
        // Obtener el estado actualizado del almacén
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Agregar el detalle de los datos del usuario actualizado
        setStore({ // Se actualiza el estado utilizando la función setStore()
            ...store, // Se mantiene el resto del estado sin cambios
            UserPasswordUpdate: { // Se actualiza la parte del estado relacionada con la actualización de contraseña del usuario
                ...store.UserPasswordUpdate, // Se mantiene el resto de los datos de la actualización de contraseña sin cambios
                [e.target.name]: e.target.value // Se actualiza el campo específico con el nuevo valor obtenido del input que causó el cambio
            },
        });
        // console.log(store); // Se puede imprimir el estado actualizado en la consola para propósitos de depuración
      },
    

      userDataHelpChangePassword: async () => { // Se define una función llamada userDataHelpChangePassword que se ejecutará para cambiar la contraseña del usuario
        const store = getStore(); // Se obtiene el estado actual del almacén
    
        // Obtener los datos del usuario del estado
        const { UserPasswordUpdate } = store;
        const { password } = UserPasswordUpdate;
    
        // console.log(store); // Se imprime el estado actual en la consola (solo para depuración)
    
        if (password.trim() === "") { // Verifica si el campo de contraseña está vacío
            // console.error("Por favor completa todos los campos.");
            return; // Detener el envío del formulario si el campo de contraseña está vacío
        }
    
        try {
            // Obtenemos el token del almacenamiento local
            let myToken = localStorage.getItem("tokenhelp");
    
            // Construimos la URL para la solicitud
            let url = "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/user";
    
            // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
            let response = await fetch(url, {
                method: "PUT", // Método de la solicitud
                headers: {
                    Authorization: `Bearer ${myToken}`, // Token de autorización
                    "Content-Type": "application/json" // Tipo de contenido de la solicitud
                },
                body: JSON.stringify(UserPasswordUpdate), // Datos de la actualización de contraseña convertidos a formato JSON y enviados en el cuerpo de la solicitud
            });
    
            // Verificamos si la respuesta de la solicitud es exitosa (status code 200-299)
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzamos un error con un mensaje apropiado
                throw new Error(`No se pudieron recuperar los datos: ${response.statusText}`);
            }
    
            // Convertimos la respuesta a formato JSON para extraer los datos
            let data = await response.json();
    
            // Si categoryDetail y pageUrl no están definidos, actualizamos el estado de la tienda directamente con los datos cargados
            let updatedStore = getStore(); // Se obtiene el estado actualizado del almacén
            setStore({ ...updatedStore, UserPasswordUpdateState: data }); // Se actualiza el estado con los datos de la actualización de contraseña
    
            // Ocultar la respuesta después de 5 segundos
            setTimeout(() => {
                setStore({ 
                    ...getStore(), 
                    UserPasswordUpdate: { password: "" }, // Se reinicia el campo de contraseña en el estado
                    UserPasswordUpdateState: [], // Se reinicia el estado relacionado con la respuesta
                    loginHelpUser: { email: "" }, // Se reinicia el campo de email en el estado relacionado con la ayuda de inicio de sesión
                    recoveredUserData: [], // Se reinicia el estado relacionado con los datos recuperados del usuario
                    loginHelpUser_true_o_false: false // Se reinicia el estado relacionado con la respuesta
                }); 
                localStorage.removeItem("tokenhelp"); // Elimina el token del localStorage
            }, 5000);
    
            // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
            console.log("Store after change:", updatedStore);
        } catch (error) {
            setStore({ ...store, UserPasswordUpdateState: error }); // Se actualiza el estado con el error
            // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
            console.error(error);
        }
      },
    

      loadDataStartWars: async () => { // Se define una función llamada loadDataStartWars que se ejecutará para cargar datos de Star Wars
        try {
            // Obtenemos el token del almacenamiento local
            let myToken = localStorage.getItem("token");
    
            // Construimos la URL para la solicitud
            let url = "https://glowing-orbit-9775rxwgrxgjh6pj-3001.app.github.dev/api/people";
    
            // Realizamos una solicitud a la URL usando fetch, incluyendo el token de autorización en los encabezados
            let response = await fetch(url, {
                method: "GET", // Método de la solicitud
                headers: {
                    Authorization: `Bearer ${myToken}` // Token de autorización
                },
            });
    
            // Verificamos si la respuesta de la solicitud es exitosa (status code 200-299)
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzamos un error con un mensaje apropiado
                throw new Error(`No se pudieron recuperar los datos: ${response.statusText}`);
            }
    
            // Convertimos la respuesta a formato JSON para extraer los datos
            let data = await response.json();
    
            let store = getStore(); // Se obtiene el estado actual del almacén
            setStore({ ...store, people: data }); // Se actualiza el estado con los datos de personajes de Star Wars
    
            // Imprimimos el estado de la tienda después de cargar los datos (solo para depuración)
            // console.log("Store after data loaded:", store);
        } catch (error) {
            // Si ocurre algún error durante el proceso, lo capturamos y lo mostramos en la consola
            console.error(error.message);
        }
      },
    

      renderItems: () => { // Se define una función llamada renderItems que se utilizará para renderizar elementos de personajes de Star Wars
        const store = getStore(); // Se obtiene el estado actual del almacén
        const { people } = store; // Se extraen los datos de los personajes del estado
    
        // Mapeamos los resultados y creamos las tarjetas correspondientes
        return people.map((item, index) => ( // Se itera sobre cada elemento en el array de personajes
            <div className={styles["cardDemo"]} key={index}> {/* Se crea una tarjeta para cada personaje, usando un índice único como clave */}
                <Link to={"/Character/" + index}> {/* Se crea un enlace a la página de detalles del personaje */}
                    <img
                        src={`https://starwars-visualguide.com/assets/img/characters/${item.id}.jpg`} // Se establece la URL de la imagen del personaje
                        className={styles["card-img-top"]} // Se establece la clase CSS para la imagen de la tarjeta
                        alt={`Image for ${item.name}`} // Se establece el atributo alt de la imagen
                        onError={(e) => { // Se define un manejador de errores para la imagen
                            e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"; // Si la imagen no se puede cargar, se muestra una imagen de marcador de posición
                        }}
                    />
                </Link>
                <div className={styles["card-bodyDemo"]}> {/* Se crea el cuerpo de la tarjeta */}
                    <h5 className={styles["card-titleDemo"]}> {/* Se crea el título de la tarjeta */}
                        <Link to={"/Character/" + index}> {/* Se crea un enlace al detalle del personaje */}
                            {item.name || "Título no disponible"} {/* Se muestra el nombre del personaje, si está disponible, de lo contrario se muestra un mensaje de título no disponible */}
                        </Link>
                    </h5>
                </div>
            </div>
        ));
      },
    

      closeSession: () => { // Se define una función llamada closeSession que se utilizará para cerrar la sesión del usuario
        const store = getStore(); // Se obtiene el estado actual del almacén
        const { login_true_o_false } = store; // Se extraen datos relevantes del estado global
    
        // Verificar si el usuario ha iniciado sesión
        if (login_true_o_false === 'Password correct') { // Si el estado de inicio de sesión es "Password correct"
            // Eliminar la información de inicio de sesión del almacenamiento local y restablecer los datos del usuario
            setStore({
                ...getStore(), // Se mantiene el resto del estado sin cambios
                people: [], // Se vacía la lista de personajes
                loginUser: { email: "", password: "" }, // Se reinicia la información de inicio de sesión
                login_true_o_false: false, // Se reinicia el estado de inicio de sesión
                dataUser: { // Se reinician los datos del usuario
                    email: "",
                    name: "",
                    last_name: "",
                    username: "",
                    password: "",
                }, recoveredUserData:[]
            });
            // console.log(store); // Se imprime el estado actualizado en la consola (para propósitos de depuración)
        }
      },
    
    },
  };
};

export default getState;
