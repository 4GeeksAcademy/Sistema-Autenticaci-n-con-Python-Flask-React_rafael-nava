"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Character
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import timedelta

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#-------ENCRIPTACION JWT------
#la inicialización de JWTManager está en la carpeta app.py despues de la declaración del servidor Flask
jwt = JWTManager()

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

        existing_user = User.query.filter_by(email=data['email']).first()  # Busca un usuario en la base de datos con el mismo email
        if existing_user:  # Verifica si ya existe un usuario con el mismo email
            return jsonify({'error': 'Email already exists.'}), 409  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo email

        existing_username = User.query.filter_by(username=data['username']).first()  # Busca un usuario en la base de datos con el mismo username
        if existing_username:  # Verifica si ya existe un usuario con el mismo username
            return jsonify({'error': 'Username already exists.'}), 409  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo username

        password_hash = generate_password_hash(data['password']).decode('utf-8')

        new_user = User(email=data['email'], password=password_hash, username=data['username'], name=data.get('name'), last_name=data.get('last_name'), is_active=True)  # Crea un nuevo usuario con los datos proporcionados

        db.session.add(new_user)  # Agrega el nuevo usuario a la sesión de la base de datos
        db.session.commit()  # Confirma los cambios en la base de datos
 
        return jsonify({'message': 'User created successfully'}), 201  # Devuelve un mensaje de éxito con el ID del nuevo usuario y un código de estado 201
   
    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento


#-------------------CREAR  TOKEN--------------------------------------------------------------------------
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


    # #----------------token de juguete-----------------------------------------------        
    #     existing_password = User.query.filter_by(password=data['password']).first()  # Busca un usuario en la base de datos con el mismo username
    #     if existing_password:  # Verifica si ya existe un usuario con el mismo username
    #         return jsonify({'password': True}), 200  # Devuelve un error con código de estado 409 si ya existe un usuario con el mismo username
    #     else:
    #         return jsonify({'password': False}), 400
        
    except Exception as e:  # Captura cualquier excepción que ocurra dentro del bloque try
        return jsonify({'error': 'Error login user: ' + str(e)}), 500  # Devuelve un mensaje de error con un código de estado HTTP 500 si ocurre una excepción durante el procesamiento




#-------------------RESTRICCION POR TOKEN  USUARIOS--------------------------------------------------------------------------
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

