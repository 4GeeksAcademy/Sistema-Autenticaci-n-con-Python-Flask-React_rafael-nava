from flask import jsonify, url_for

class APIException(Exception):
    status_code = 400  # Código de estado por defecto para la excepción

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message  # Mensaje de la excepción
        if status_code is not None:
            self.status_code = status_code  # Actualización del código de estado si se proporciona uno personalizado
        self.payload = payload  # Carga útil de la excepción

    def to_dict(self):
        rv = dict(self.payload or ())  # Crear un diccionario con la carga útil de la excepción si está presente
        rv['message'] = self.message  # Agregar el mensaje de la excepción al diccionario
        return rv  # Devolver el diccionario con la información de la excepción

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()  # Obtener los valores predeterminados de la regla si existen
    arguments = rule.arguments if rule.arguments is not None else ()  # Obtener los argumentos de la regla si existen
    return len(defaults) >= len(arguments)  # Verificar si el número de valores predeterminados es mayor o igual al número de argumentos

def generate_sitemap(app):
    links = ['/admin/']  # Lista de enlaces para el mapa del sitio, incluyendo la ruta de admin por defecto
    for rule in app.url_map.iter_rules():
        # Filtrar reglas que no se pueden navegar en un navegador y reglas que requieren parámetros
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))  # Generar la URL para la regla actual
            if "/admin/" not in url:  # Excluir las rutas relacionadas con el admin
                links.append(url)  # Agregar la URL a la lista de enlaces

    # Generar el HTML para mostrar los enlaces del mapa del sitio
    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"  # HTML que incluye los enlaces del mapa del sitio
