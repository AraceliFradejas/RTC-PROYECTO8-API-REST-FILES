# Memoria del proyecto

## The Eras Tour API REST Files

**Autora:** Araceli Fradejas Muñoz  
**Formación:** Módulo 5: Backend [Node | Mongo | API REST], máster Rock The Code, The Power Tech School

## 1. Objetivo

El proyecto desarrolla una API REST con Express y MongoDB Atlas dedicada a documentar los 149 conciertos de *The Eras Tour*. Relaciona cada concierto con su repertorio habitual, sus actuaciones sorpresa y las canciones que forman cada mashup.

## 2. Arquitectura

La aplicación separa responsabilidades en configuración, modelos, controladores, rutas, middleware, utilidades, datos y semillas. Las colecciones principales son `songs` y `concerts`, relacionadas mediante identificadores de Mongoose. Las consultas de conciertos utilizan `populate()` para devolver las canciones completas.

## 3. Datos y semillas

- 238 canciones, incluidas las interpretaciones sorpresa y colaboraciones necesarias.
- 149 conciertos comprendidos entre el 17 de marzo de 2023 y el 8 de diciembre de 2024.
- Dos versiones principales del repertorio: `pre-ttpd` y `post-ttpd`.
- Variaciones concretas y mashups conservados por fecha, instrumento y orden.
- Semillas idempotentes basadas en `upsert`.
- Tres fechas canceladas en Viena documentadas aparte, sin alterar el total de conciertos realizados.
- Asistencia individual opcional, diferenciando cifras comunicadas y estimaciones con su fuente.
- Búsquedas de cada canción en Spotify, Apple Music y Amazon Music.

La segunda ejecución verificada de ambas semillas produjo 0 creaciones y 0 actualizaciones, por lo que no genera duplicados cuando los datos ya están sincronizados.

La asistencia se incorpora únicamente cuando una fuente identifica una noche concreta. No se utiliza la capacidad del recinto y tampoco se dividen los totales de varias noches, ya que hacerlo produciría cifras no publicadas. Los conciertos sin información individual fiable mantienen `attendance: null`.

### Nota histórica de Viena

Las fechas previstas para el 8, 9 y 10 de agosto de 2024 en el Ernst-Happel-Stadion se cancelaron tras conocerse una amenaza de atentado. La API conserva este episodio mediante un endpoint histórico independiente y recuerda la reacción de los swifties que se reunieron en las calles de Viena para cantar y compartir pulseras.

Durante la investigación se localizaron fotografías editoriales del encuentro, pero no una imagen de la escena con licencia de reutilización verificable. Por responsabilidad con la propiedad intelectual, el proyecto conserva `communityImage: null` y no descarga esas fotografías. El campo permitirá añadir en el futuro una fotografía cedida por su autora o publicada bajo una licencia compatible.

## 4. Gestión de archivos

Multer recibe los archivos en memoria y la utilidad compartida los sube a Cloudinary cambiando únicamente la carpeta de destino:

- `eras-tour/songs`
- `eras-tour/concerts`

Cada documento conserva la URL segura, el `public_id`, el texto alternativo y los datos opcionales de procedencia, autoría y licencia. Al sustituir o borrar una imagen, la aplicación elimina de Cloudinary el recurso que deja de utilizarse. También intenta limpiar una subida nueva si la operación de MongoDB falla.

## 5. Pruebas y evidencias

Las pruebas seguirán el orden documentado en [`INSOMNIA.md`](INSOMNIA.md). Las imágenes se incorporarán al finalizar cada bloque para que la memoria muestre el comportamiento real de la aplicación.

### 5.1 MongoDB Atlas

> Pendiente: captura de las colecciones `songs` y `concerts`, recuentos y documento con relaciones.

### 5.2 Cloudinary

> Pendiente: capturas de las carpetas, subida, sustitución y eliminación de archivos.

### 5.3 Insomnia

> Pendiente: capturas del CRUD de ambas colecciones, filtros, relaciones y errores controlados.

## 6. Seguridad

Las credenciales permanecen en `.env`, excluido del repositorio público. Las capturas no deben mostrar la URI privada de Atlas, contraseñas ni el API Secret de Cloudinary. El archivo `.env.example` solamente documenta los nombres de las variables necesarias.

## 7. Aviso académico

Proyecto independiente, no oficial y sin finalidad comercial, realizado desde el cariño, el respeto y la admiración de una swiftie por Taylor Swift y *The Eras Tour*. Los nombres, marcas y obras citados pertenecen a sus titulares. Los datos se emplean exclusivamente con fines formativos y se acompañan de sus fuentes.
