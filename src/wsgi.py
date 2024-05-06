# Este archivo fue creado para ejecutar la aplicación en Heroku utilizando Gunicorn.
# Gunicorn es un servidor HTTP WSGI para Python que se utiliza para manejar solicitudes HTTP y comunicarse con la aplicación Flask para procesarlas.
# Read more about it here: https://devcenter.heroku.com/articles/python-gunicorn


# Importamos la aplicación Flask creada en el archivo 'app.py' y la asignamos a una variable llamada 'application'.
from app import app as application

# Esta condición verifica si este archivo se está ejecutando como el programa principal.
if __name__ == "__main__":
    # Si este archivo se ejecuta directamente, la aplicación Flask se inicia en el puerto por defecto (5000).
    application.run()
