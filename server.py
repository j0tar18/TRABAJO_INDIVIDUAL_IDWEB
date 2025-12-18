from wsgiref.simple_server import make_server
import mysql.connector
import os
import mimetypes
from urllib.parse import parse_qs

# --- CONFIGURACIÓN ---
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'jotar_db'
}

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')

def get_static_content(filename):
    full_path = os.path.join(STATIC_DIR, filename.lstrip("/"))
    
    if os.path.isfile(full_path):
        mime_type, _ = mimetypes.guess_type(full_path)
        if mime_type is None:
            mime_type = "application/octet-stream"
            
        with open(full_path, "rb") as f:
            return f.read(), mime_type
    return None, None

def app(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')
    
    if path == "/" and method == "GET":
        content, mime = get_static_content("index.html")
        
        if content:
            start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
            return [content]

    static_content, static_mime = get_static_content(path)
    if static_content:
        start_response('200 OK', [('Content-Type', static_mime)])
        return [static_content]

    if path == "/admin" and method == "GET":
        try:
            with open(os.path.join(TEMPLATE_DIR, 'login.html'), 'rb') as f:
                content = f.read()
            start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
            return [content]
        except IOError:
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
            return [b"Error: Falta login.html en templates"]

    if path == "/enviar" and method == "POST":
        try:
            size = int(environ.get('CONTENT_LENGTH', 0))
            body = environ['wsgi.input'].read(size).decode('utf-8')
            params = parse_qs(body)
            
            nombre = params.get('nombre', [''])[0]
            correo = params.get('correo', [''])[0]
            interes = params.get('interes', [''])[0]
            mensaje = params.get('mensaje', [''])[0]

            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            sql = "INSERT INTO mensajes (nombre, correo, interes, mensaje) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (nombre, correo, interes, mensaje))
            conn.commit()
            cursor.close()
            conn.close()

            response_html = """
                <script>
                    alert('¡Mensaje enviado correctamente!');
                    window.location.href = 'contacto.html';
                </script>
            """
            start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
            return [response_html.encode('utf-8')]
        except Exception as e:
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain; charset=utf-8')])
            return [f"Error BD: {str(e)}".encode('utf-8')]

    if path == "/admin-panel" and method == "POST":
        try:
            size = int(environ.get('CONTENT_LENGTH', 0))
            body = environ['wsgi.input'].read(size).decode('utf-8')
            params = parse_qs(body)
            password = params.get('password', [''])[0]

            if password == "admin123":
                conn = mysql.connector.connect(**DB_CONFIG)
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM mensajes ORDER BY fecha DESC")
                mensajes = cursor.fetchall()
                conn.close()

                filas_html = ""
                for msg in mensajes:
                    filas_html += f"<tr><td>{msg[5]}</td><td>{msg[1]}</td><td>{msg[2]}</td><td>{msg[3]}</td><td>{msg[4]}</td></tr>"
                
                msg_vacio = "<p class='empty-message'>No hay mensajes aún.</p>" if not filas_html else ""

                with open(os.path.join(TEMPLATE_DIR, 'panel.html'), 'r', encoding='utf-8') as f:
                    template = f.read()
                
                html_final = template.replace('{{TABLA_FILAS}}', filas_html).replace('{{MENSAJE_VACIO}}', msg_vacio)
                
                start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
                return [html_final.encode('utf-8')]
            else:
                start_response('401 Unauthorized', [('Content-Type', 'text/html; charset=utf-8')])
                return [b"<h1>Acceso Denegado</h1><a href='/admin'>Intentar de nuevo</a>"]
        except Exception as e:
            start_response('500 Error', [('Content-Type', 'text/plain')])
            return [str(e).encode('utf-8')]

    if path == "/admin-panel" and method == "GET":
        start_response('303 See Other', [('Location', '/admin')])
        return []

    start_response('404 Not Found', [('Content-Type', 'text/plain')])
    return [b"Error 404: Pagina no encontrada"]

if __name__ == "__main__":
    print(f"--> Servidor WSGI corriendo en http://localhost:{PORT}")
    print(f"--> Sirviendo estáticos desde: {STATIC_DIR}")
    server = make_server('localhost', PORT, app)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")