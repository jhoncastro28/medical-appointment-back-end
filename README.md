# Medical Appointments Backend

Este es el backend de una aplicación web para gestionar citas médicas. Proporciona las funcionalidades de crear, consultar y cancelar citas médicas. Las citas se almacenan en memoria mientras el servidor está en ejecución, y las autorizaciones en formato de imagen se guardan en disco.

## Requisitos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (versión 6 o superior)

Se utilizan las siguientes tecnologías y paquetes:

- **Node.js**: Entorno de ejecución para el servidor.
- **Express.js**: Framework web para manejar las rutas y peticiones HTTP.
- **Multer**: Middleware para la subida de archivos (en este caso, las imágenes de autorización).
- **UUID**: Generación de identificadores únicos para las citas.
