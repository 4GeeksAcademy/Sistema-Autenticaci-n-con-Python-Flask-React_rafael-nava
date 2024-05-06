"""
Este módulo se encarga de iniciar el servidor API, cargar la base de datos y agregar los puntos finales.
"""

from flask import Flask, request, jsonify, url_for, Blueprint  # Importación de Flask y funciones relacionadas
from api.models import db, User, Character, SecurityQuestion  # Importación de los modelos de la base de datos
from api.utils import generate_sitemap, APIException  # Importación de funciones de utilidad y excepciones personalizadas
from flask_cors import CORS  # Importación de CORS para permitir solicitudes desde otros dominios
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # Importación de JWT para autenticación y autorización basada en tokens
from flask_bcrypt import generate_password_hash, check_password_hash  # Importación de bcrypt para encriptación de contraseñas
from datetime import timedelta  # Importación de timedelta para manejar intervalos de tiempo

api = Blueprint('api', __name__)  # Creación de un Blueprint para agrupar las rutas relacionadas con la API
# Un Blueprint es una forma de organizar y estructurar las rutas de una aplicación Flask en grupos lógicos y modularizados. 
# Es una característica que permite dividir la aplicación en componentes más pequeños y reutilizables, 
# lo que facilita la gestión y mantenimiento del código.

# Allow CORS requests to this API
CORS(api)  # Habilitar CORS para permitir solicitudes cruzadas desde el frontend hacia la API

#-------ENCRIPTACION JWT------
#la inicialización de JWTManager está en la carpeta app.py despues de la declaración del servidor Flask
jwt = JWTManager()  # Inicialización del JWTManager para manejar la generación y verificación de tokens JWT


#-------------------CONSULTAR TODOS LOS USUARIOS--------------------------------------------------------------------------
@api.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        if not users:
            return jsonify({'message': 'No users found'}), 404
        
        response_body = [user.serialize() for user in users]
        return jsonify(response_body), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# @api.route('/users', methods=['GET'])
# @jwt_required() # Decorador para requerir autenticación con JWT
# def show_people():
#     try:
#         current_user_id = get_jwt_identity() # Obtiene la id del usuario del token
#         current_user_id = User.query.all()
#         if not current_user_id:
#             return jsonify({'message': 'No users found'}), 404
#         response_body = [users.serialize() for users in current_user_id]
#         return jsonify(response_body), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500



#-------------------CONSULTAR UN USUARIO UNICO--------------------------------------------------------------------------

@api.route('/user', methods=['GET'])
@jwt_required() 
def get_user_by_email():
    try:

        current_user_id = get_jwt_identity() # Obtiene la id del usuario del token
        user = User.query.get(current_user_id) # Buscar al usuario por su ID
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify(user.serialize()), 200 # Devolver los datos del usuario encontrado
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#------ actualizar el usuario---------
@api.route('/user', methods=['PUT'])  # Define un endpoint para actualizar un personaje mediante una solicitud PUT
@jwt_required() 
def update_user():
    try:

        data = request.json  # Obtén los datos JSON enviados en la solicitud
        if not data:  # Verifica si no se proporcionaron datos JSON
            return jsonify({'error': 'No data provided'}), 400  # Devuelve un error con código de estado 400 si no se proporcionaron datos
        
        current_user_id = get_jwt_identity() # Obtiene la id del usuario del token  # Busca el usuaerio en la base de datos utilizando su ID
        user = User.query.get(current_user_id) # Buscar al usuario por su ID

        if not user:  # Verifica si el user no fue encontrado en la base de datos
            return jsonify({'error': 'User not found'}), 404  # Devuelve un error con código de estado 404 si el user no fue encontrado
    
        # Iterar sobre cada campo en el JSON y actualizar el user si corresponde
        for key, value in data.items():  #items() para iterar sobre cada par llave-valor en el JSON recibido
            # Verificar si el campo existe en la clase Character
            if hasattr(user, key):  # Verifica si el user tiene un atributo con el nombre de la llave
                if  key == 'password': #verificamos si unos de los atributos es password la hasheamos para luego incluirtla
                    password_hash = generate_password_hash(value).decode('utf-8') #hasheamos la nueva contraseña
                    setattr(user, key, password_hash) # iteramos sobre la llave 'password' y le asigamos la nueva contraseña hasheada
                else:
                    # Para otros campos, asignar el valor directamente al atributo correspondiente del usuario
                    setattr(user, key, value)

        db.session.commit()  # Confirma los cambios en la base de datos
        return jsonify({'message': 'Password updated successfully'})  # Devuelve un mensaje de éxito indicando que el personaje se actualizó correctamente
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



#-------------------CREAR  USUARIOS--------------------------------------------------------------------------
@api.route('/users', methods=['POST'])  # Define un endpoint para agregar un nuevo usuario mediante una solicitud POST a la ruta '/users'
def create_new_user():  # Define la función que manejará la solicitud
    try:  # Inicia un bloque try para manejar posibles excepciones
        data = request.json  # Obtén los datos JSON enviados en la solicitud
        if not data:  # Verifica si no se proporcionaron datos JSON
            return jsonify({'error': 'No data provided'}), 400  # Devuelve un error con código de estado 400 si no se proporcionaron datos

        if 'email' not in data:  # Verifica si 'email' no está presente en los datos JSON
            return jsonify({'error': 'Email is required'}), 400  # Devuelve un error con código de estado 400 si 'email' no está presente

        if 'username' not in data:  # Verifica si 'username' no está presente en los datos JSON
            return jsonify({'error': 'Username is required'}), 400  # Devuelve un error con código de estado 400 si 'username' no está presente

        if 'password' not in data:  # Verifica si 'password' no está presente en los datos JSON
            return jsonify({'error': 'Password is required'}), 400  # Devuelve un error con código de estado 400 si 'password' no está presente

        # Verifica si se proporcionan las preguntas y respuestas de seguridad en los datos JSON
        if 'security_questions' not in data or len(data['security_questions']) != 2:
            return jsonify({'error': 'Security questions and answers are required'}), 400

        existing_user = User.query.filter_by(email=data['email']).first()  # Busca un usuario en la base de datos con el mismo email
        if existing_user:  # Verifica si ya existe un usuario con el mismo email
            return jsonify({'error': 'Email already exists.'}), 409  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo email

        existing_username = User.query.filter_by(username=data['username']).first()  # Busca un usuario en la base de datos con el mismo username
        if existing_username:  # Verifica si ya existe un usuario con el mismo username
            return jsonify({'error': 'Username already exists.'}), 409  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo username

        password_hash = generate_password_hash(data['password']).decode('utf-8')

        # Crea un nuevo usuario con los datos proporcionados
        new_user = User(email=data['email'], password=password_hash, username=data['username'], name=data.get('name'), last_name=data.get('last_name'), is_active=True)
       
        # Agrega las preguntas y respuestas de seguridad al usuario
        for question_answer in data['security_questions']:
            new_question = SecurityQuestion(
                question=question_answer['question'],
                answer=question_answer['answer']
            )
            new_user.security_questions.append(new_question)

        db.session.add(new_user)  # Agrega el nuevo usuario a la sesión de la base de datos
        db.session.commit()  # Confirma los cambios en la base de datos
 
        return jsonify({'message': 'User created successfully'}), 201  # Devuelve un mensaje de éxito con el ID del nuevo usuario y un código de estado 201
   
    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento



#-------------------CREAR  TOKEN LOGIN--------------------------------------------------------------------------
@api.route('/token', methods=['POST'])  # Define un endpoint para agregar un nuevo usuario mediante una solicitud POST a la ruta '/users'
def create_token():  # Define la función que manejará la solicitud
    try:  # Inicia un bloque try para manejar posibles excepciones
        data = request.json  # Obtén los datos JSON enviados en la solicitud
        if not data:  # Verifica si no se proporcionaron datos JSON
            return jsonify({'error': 'No data provided'}), 400  # Devuelve un error con código de estado 400 si no se proporcionaron datos

        if 'email' not in data:  # Verifica si 'email' no está presente en los datos JSON
            return jsonify({'error': 'Email is required'}), 400  # Devuelve un error con código de estado 400 si 'email' no está presente

        if 'password' not in data:  # Verifica si 'password' no está presente en los datos JSON
            return jsonify({'error': 'Password is required'}), 400  # Devuelve un error con código de estado 400 si 'password' no está presente

        existing_user = User.query.filter_by(email=data['email']).first()  # Busca un usuario en la base de datos con el mismo email
        if not existing_user:  # Verifica si ya existe un usuario con el mismo email
            return jsonify({'error': 'Email does not exist.'}), 400  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo email

        password_user_db = existing_user.password  # Extraemos la contraseña almacenada del usuario existente en la base de datos

        true_o_false = check_password_hash(password_user_db, data['password'])  # Comparamos la contraseña ingresada en el formulario con la contraseña almacenada en la base de datos, después de descifrarla

        if true_o_false:  # Si la comparación es verdadera, es decir, las contraseñas coinciden
            expires = timedelta(days=1)  # Configuramos la duración del token de acceso
            user_id = existing_user.id  # Obtenemos el ID del usuario existente en la base de datos
            access_token = create_access_token(identity=user_id, expires_delta=expires)  # Creamos un token de acceso para el usuario
            return jsonify({'access_token': access_token, 'login': True}), 200  # Devolvemos el token de acceso como respuesta exitosa
        else:  # Si la comparación de contraseñas es falsa, es decir, las contraseñas no coinciden
            return jsonify({'error': 'Incorrect password'}), 400  # Devolvemos un mensaje de error indicando que la contraseña es incorrecta

    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error login user: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento



#-------------------CREAR  TOKEN recuperar contraseña--------------------------------------------------------------------------
@api.route('/tokenLoginHelp', methods=['POST'])  # Define un endpoint para agregar un nuevo usuario mediante una solicitud POST a la ruta '/users'
def create_token_login_help():  # Define la función que manejará la solicitud
    try:  # Inicia un bloque try para manejar posibles excepciones
        data = request.json  # Obtén los datos JSON enviados en la solicitud
        if not data:  # Verifica si no se proporcionaron datos JSON
            return jsonify({'error': 'No data provided'}), 400  # Devuelve un error con código de estado 400 si no se proporcionaron datos

        if 'email' not in data:  # Verifica si 'email' no está presente en los datos JSON
            return jsonify({'error': 'Email is required'}), 400  # Devuelve un error con código de estado 400 si 'email' no está presente

        existing_user = User.query.filter_by(email=data['email']).first()  # Busca un usuario en la base de datos con el mismo email
        if existing_user:  # Si la comparación es verdadera, es decir, el email coinciden
            expires = timedelta(hours=1)  # Configuramos la duración del token de acceso
            user_id = existing_user.id  # Obtenemos el ID del usuario existente en la base de datos
            access_token = create_access_token(identity=user_id, expires_delta=expires)  # Creamos un token de acceso para el usuario
            return jsonify({'access_token': access_token, 'login': True}), 200  # Devolvemos el token de acceso como respuesta exitosa
        else:  # Si la comparación de contraseñas es falsa, es decir, las contraseñas no coinciden
            return jsonify({'error': 'Email does not exist.'}), 400  # Devuelve un error con código de estado 400 si ya existe un usuario con el mismo email
    
    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error email user: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento


    # #----------------token de juguete-----------------------------------------------        
    #     existing_password = User.query.filter_by(password=data['password']).first()  # Busca un usuario en la base de datos con el mismo username
    #     if existing_password:  # Verifica si ya existe un usuario con el mismo username
    #         return jsonify({'password': True}), 200  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo username
    #     else:
    #         return jsonify({'password': False}), 400
        
    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error login user: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento


#-------------------RESTRICCION POR TOKEN  PARA ACCEDER A LA DATA--------------------------------------------------------------------------
@api.route('/people', methods=['GET'])
@jwt_required() # Decorador para requerir autenticación con JWT
def show_people():
    current_user_id = get_jwt_identity() # Obtiene la id del usuario del token
    if current_user_id:
        characters = Character.query.all()
        serialized_characters = [character.serialize() for character in characters]
        return jsonify(serialized_characters), 200
    else:
        return {"Error": "Token inválido"}, 401

#-----------------------------------------------------------METODOS PARA CHARACTERS-------------------------------------------------------------

# Obtener todos los personajes ### OK ###
@api.route('/characters', methods=['GET'])
def get_characters():
    characters = Character.query.all()
    serialized_characters = [character.serialize() for character in characters]
    return jsonify(serialized_characters)

# Agregar un nuevo personaje ### OK ###
@api.route('/characters', methods=['POST'])  # Define un endpoint para agregar un nuevo personaje mediante una solicitud POST a la ruta '/characters'
def add_character():  # Define la función que manejará la solicitud
    data = request.json  # Obtén los datos JSON enviados en la solicitud
    if not data:  # Verifica si no se proporcionaron datos JSON
        return jsonify({'error': 'No data provided'}), 400  # Devuelve un error con código de estado 400 si no se proporcionaron datos

    # Crear un nuevo objeto Character y asignar los valores del JSON
    character = Character()  # Crea una nueva instancia de la clase Character
    for key, value in data.items():  #items() para iterar sobre cada par llave-valor en el JSON recibido
        if hasattr(character, key):  # Verifica si el campo existe en el modelo de Character
            setattr(character, key, value)  # Asigna el valor del campo al objeto Character utilizando setattr

    # Agregar el nuevo personaje a la base de datos
    db.session.add(character)  # Agrega el objeto Character a la sesión de la base de datos
    db.session.commit()  # Confirma los cambios en la base de datos

    return jsonify({'message': 'Character created successfully', 'character_id': character.id}), 201  # Devuelve un mensaje de éxito con el ID del nuevo personaje y un código de estado 201

