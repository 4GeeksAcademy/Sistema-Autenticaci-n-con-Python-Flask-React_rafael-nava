import click  # Importación del módulo click para la creación de comandos de Flask
from api.models import db, User  # Importación del modelo db y User desde el módulo api.models

"""
En este archivo, puedes agregar tantos comandos como desees utilizando el decorador @app.cli.command
Los comandos de Flask son útiles para ejecutar tareas programadas o tareas fuera de la API pero aún en integración
con tu base de datos, por ejemplo: Importar el precio de bitcoin cada noche a las 12 a.m.
"""
def setup_commands(app):
    
    """ 
    Este es un comando de ejemplo "insert-test-users" que puedes ejecutar desde la línea de comandos
    escribiendo: $ flask insert-test-users 5
    Nota: 5 es el número de usuarios a agregar
    """
    # @app.cli.command("insert-test-users") # nombre de nuestro comando
    # @click.argument("count") # argumento de nuestro comando
    # def insert_test_users(count):
    #     print("Creating test users")
    #     for x in range(1, int(count) + 1):
    #         user = User()
    #         user.name = "rafa"+ str(x)
    #         user.last_name = "nava"+ str(x)
    #         user.username = "rafa78"+ str(x)
    #         user.email = "test_user" + str(x) + "@test.com"
    #         user.password = "123456"
    #         user.is_active = True
    #         db.session.add(user)
    #         db.session.commit()
    #         print("User: ", user.email, " created.")

    #     print("All test users created")


    @app.cli.command("insert-test-data")
    def insert_test_data():
        count = input("Enter the number of test users to create: ")  # Solicitar al usuario que ingrese el número de usuarios de prueba a crear
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.name = "user" + str(x)
            user.last_name = "prueba" + str(x)
            user.username = "userprueba" + str(x)
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User:", user.username, "created.")

        print("All test users created")
