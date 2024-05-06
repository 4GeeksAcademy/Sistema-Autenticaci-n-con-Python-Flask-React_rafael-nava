from flask_sqlalchemy import SQLAlchemy  # Importación del módulo SQLAlchemy para interactuar con la base de datos
from datetime import datetime  # Importación del módulo datetime para trabajar con fechas y horas
import json  # Importación del módulo json para trabajar con datos en formato JSON

db = SQLAlchemy()  # Creación de una instancia de SQLAlchemy para interactuar con la base de datos

# Definir la clase de usuario (tabla de usuarios en la base de datos)
class User(db.Model):  # Definir una clase que hereda de la clase Model de SQLAlchemy
    # Definir las columnas de la tabla de usuarios
    id = db.Column(db.Integer, primary_key=True)  # Definir una columna de tipo entero como clave primaria
    email = db.Column(db.String(120), unique=True, nullable=False)  # Definir una columna de tipo string con restricciones de unicidad y no nulidad
    password = db.Column(db.String(80), unique=False, nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)  # Definir una columna de tipo booleano con restricciones de no nulidad
    username = db.Column(db.String(80), unique=True, nullable=False)  # Definir una columna de tipo string con restricciones de unicidad y no nulidad
    name = db.Column(db.String(80), unique=False, nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    last_name = db.Column(db.String(80), unique=False, nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    security_questions = db.relationship("SecurityQuestion", backref="user", lazy=True)  # Relación uno a muchos con la tabla de preguntas de seguridad

    # Método para representar un objeto de usuario como una cadena
    def __repr__(self):  # Definir un método para representación de cadena
        return '<User %r>' % self.id  # Devolver una cadena que representa el objeto usuario

    # Método para serializar un objeto de usuario a un diccionario JSON
    def serialize(self):  # Definir un método para serializar el objeto usuario
        return {  # Devolver un diccionario con los atributos del usuario
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name": self.name, 
            "last_name": self.last_name,
            "security_questions_question1": self.security_questions[0].question,
            "security_questions_answer1": self.security_questions[0].answer,
            "security_questions_question2": self.security_questions[1].question,
            "security_questions_answer2": self.security_questions[1].answer,
            "password": self.password
        }
    

class SecurityQuestion(db.Model):
    # Definición de las columnas de la tabla de preguntas de seguridad
    id = db.Column(db.Integer, primary_key=True)  # Definir una columna de tipo entero como clave primaria
    question = db.Column(db.String(255), nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    answer = db.Column(db.String(255), nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # Definir una columna de clave externa

    # Método para representar un objeto de pregunta de seguridad como una cadena
    def __repr__(self):  # Definir un método para representación de cadena
        return '<SecurityQuestion %r>' % self.id  # Devolver una cadena que representa el objeto pregunta de seguridad

    # Método para serializar un objeto de pregunta de seguridad a un diccionario JSON
    def serialize(self):  # Definir un método para serializar el objeto pregunta de seguridad
        return {  # Devolver un diccionario con los atributos de la pregunta de seguridad
            "id": self.id,
            "question": self.question,
            "answer": self.answer
        }

class Character(db.Model):
    # Definición de las columnas de la tabla de personajes
    id = db.Column(db.Integer, primary_key=True)  # Definir una columna de tipo entero como clave primaria
    name = db.Column(db.String(80), nullable=False)  # Definir una columna de tipo string con restricciones de no nulidad
    eye_color = db.Column(db.String(80), nullable=True)  # Definir una columna de tipo string (opcional)
    skin_color = db.Column(db.String(80), nullable=True)  # Definir una columna de tipo string (opcional)
    gender = db.Column(db.String(10), nullable=True)  # Definir una columna de tipo string (opcional)
    height = db.Column(db.String(10), nullable=True)  # Definir una columna de tipo string (opcional)
    mass = db.Column(db.String(10), nullable=True)  # Definir una columna de tipo string (opcional)
    hair_color = db.Column(db.String(80), nullable=True)  # Definir una columna de tipo string (opcional)
    birth_year = db.Column(db.String(10), nullable=True)  # Definir una columna de tipo string (opcional)
    homeworld = db.Column(db.String(120), nullable=True)  # Definir una columna de tipo string (opcional)  
    url = db.Column(db.String(120), nullable=True)  # Definir una columna de tipo string (opcional)
    created = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)  # Definir una columna de tipo fecha y hora con valor predeterminado
    edited = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)  # Definir una columna de tipo fecha y hora con valor predeterminado y actualización automática
    film = db.Column(db.String(120), nullable=True)  # Definir una columna de tipo string (opcional)

    def __repr__(self):  # Método para representar un objeto de personaje como una cadena
        return '<Character %r>' % self.id  # Devolver una cadena que representa el objeto personaje

    def serialize(self):  # Método para serializar un objeto de personaje a un diccionario JSON
        return {  # Devolver un diccionario con los atributos del personaje
            "id": self.id,
            "name": self.name,
            "eye_color": self.eye_color,
            "skin_color": self.skin_color,
            "gender": self.gender,
            "height": self.height,
            "mass": self.mass,
            "hair_color": self.hair_color,
            "birth_year": self.birth_year,
            "homeworld": self.homeworld,
            "url": self.url,
            "created": self.created.strftime('%Y-%m-%d'),  # Formatear la fecha de creación '%Y-%m-%dT%H:%M:%S.%fZ'
            "edited": self.edited.strftime('%Y-%m-%d'),  # Formatear la fecha de edición
            "film": self.film
         }
