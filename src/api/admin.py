import os  # Importación del módulo os para acceder a funcionalidades dependientes del sistema operativo
from flask_admin import Admin  # Importación de la clase Admin desde flask_admin
from .models import db, User, Character, SecurityQuestion  # Importación de los modelos db, User, Character y SecurityQuestion desde el archivo models
from flask_admin.contrib.sqla import ModelView  # Importación de la clase ModelView desde flask_admin.contrib.sqla

def setup_admin(app):
    # Configuración de la clave secreta de la aplicación obtenida del entorno o con un valor de muestra
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    # Configuración del aspecto de la interfaz de administración de Flask
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    # Creación de una instancia de la clase Admin para administrar la aplicación, con nombre '4Geeks Admin' y modo de plantilla 'bootstrap3'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Agrega tus modelos aquí, por ejemplo, así es como agregamos el modelo User al administrador
    # Añadir vista del modelo User a la interfaz de administración
    admin.add_view(ModelView(User, db.session))
    # Añadir vista del modelo SecurityQuestion a la interfaz de administración
    admin.add_view(ModelView(SecurityQuestion, db.session))
    # Añadir vista del modelo Character a la interfaz de administración
    admin.add_view(ModelView(Character, db.session))

    # Puedes duplicar esa línea para agregar nuevos modelos
    # admin.add_view(ModelView(YourModelName, db.session))
