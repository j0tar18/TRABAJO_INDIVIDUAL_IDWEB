# Jotar Living - Plataforma de Bienes Raíces

![Jotar Living Logo](static/imagenes/j0tar_Logo.png)

**Jotar Living** es una aplicación web personal desarrollada como trabajo final para el curso de Introducción al Desarrollo Web. Es una plataforma inmobiliaria diseñada para la exhibición y venta de proyectos inmobiliarios en Arequipa, Perú.

## Características Principales

### Frontend
* **Interactividad:**
    * Slider de imágenes automático en la página de inicio.
    * Sistema de filtrado dinámico en tiempo real para propiedades.
* **Estructura:** 6 páginas HTML5 semánticas con estilos CSS3 personalizados (`styles.css` y `admin.css`).

### Backend
* **Servidor WSGI:** Implementado en Python  usando `wsgiref.simple_server`.
* **Manejo de Rutas:** Enrutamiento manual para peticiones GET y POST.
* **Gestión de Archivos Estáticos:** Servidor configurado para entregar CSS, JS e imágenes.
* **Seguridad:** Panel de administración protegido con autenticación simple.

### Base de Datos
* **MySQL:** Almacenamiento persistente de los datos del formulario de contacto.
* **Tabla `mensajes`:** Registro de fecha, nombre, correo, interés y mensaje del usuario.

## Tecnologías Utilizadas

* **Lenguaje:** Python 3.13.9
* **Base de Datos:** MySQL 8.4.7
* **Frontend:** HTML5, CSS3, JavaScript
* **Librerías Python:**
    * `wsgiref`
    * `mysql-connector-python` (Conector BD)

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

1.  **Python 3.10+**: [Descargar Python](https://www.python.org/downloads/)
2.  **Servidor MySQL**: Puede ser a través de XAMPP, WAMP o MySQL Workbench.
3.  **Librería Connector**:
    ```bash
    pip install mysql-connector-python
    ```

## Instalación y Configuración

### 1. Clonar el repositorio
Descarga el código fuente en tu máquina.

### 2. Configurar la Base de Datos
1.  Abre tu gestor de base de datos (ej. phpMyAdmin o MySQL Workbench).
2.  Importa el archivo SQL ubicado en `sql/jotar_db.sql` o ejecuta el siguiente script SQL:
   
    ```sql
    CREATE DATABASE IF NOT EXISTS jotar_db;
    USE jotar_db;
    CREATE TABLE IF NOT EXISTS mensajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL,
        interes VARCHAR(50),
        mensaje TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

### 3. Configurar el Servidor
Abre el archivo `server.py` y verifica que las credenciales de la base de datos coincidan con tu configuración local:

```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',      # Tu usuario de MySQL
    'password': '',      # Tu contraseña de MySQL
    'database': 'jotar_db'
}
```

### 4. Ejecución
Para iniciar el servidor, abre una terminal en la carpeta del proyecto y ejecuta el siguiente comando:

```Bash

python server.py
```
Deberías ver el mensaje de confirmación:
--> Servidor WSGI corriendo en http://localhost:8000

### 5. Accesos
Una vez el servidor esté corriendo, puedes acceder a:

Sitio Web Público: http://localhost:8000

Panel Administrativo: http://localhost:8000/admin
Contraseña: admin123

### Autor
José Raúl Ludeña Daza
Curso: Introducción al Desarrollo Web

Año: 2025
