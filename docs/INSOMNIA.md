# Guía de pruebas en Insomnia

Esta guía se utilizará para probar el CRUD y reunir las evidencias de la memoria. No borres las peticiones ni las respuestas hasta terminar las capturas.

## 1. Importar la colección

1. Inicia el servidor con `npm start`.
2. Abre Insomnia y selecciona **Create > Import**.
3. Elige **File** e importa `docs/openapi.yaml`.
4. Comprueba que la URL base sea `http://localhost:5050/api`.

## 2. Orden de las pruebas

Realizaremos las peticiones en este orden:

1. `GET /` para comprobar el servidor.
2. `GET /songs` y los filtros `title`, `album` y `era`.
3. `GET /concerts` y los filtros `city`, `country`, `tourLeg` y `setlistVersion`.
4. `GET /songs/:id` y `GET /concerts/:id`.
5. Crear una canción de prueba con imagen.
6. Actualizar la canción y sustituir su imagen.
7. Crear un concierto de prueba relacionado con canciones existentes.
8. Actualizar el concierto y sustituir su imagen.
9. Intentar borrar una canción relacionada para comprobar el error `409`.
10. Borrar el concierto y comprobar que Cloudinary elimina su imagen.
11. Borrar la canción y comprobar que Cloudinary elimina su imagen.

## 3. Campos multipart de canciones

En `POST /songs`, selecciona **Multipart Form** y completa:

| Campo | Tipo | Ejemplo |
| --- | --- | --- |
| `title` | Text | `Test Song - Insomnia` |
| `artist` | Text | `Taylor Swift` |
| `album` | Text | `Test Album` |
| `era` | Text | `Test Era` |
| `releaseYear` | Text | `2024` |
| `image` | File | Imagen de prueba con uso permitido |
| `imageAlt` | Text | `Imagen de prueba de la canción` |
| `imageSourceUrl` | Text | URL de procedencia, si corresponde |
| `imageAuthor` | Text | Autoría, si corresponde |
| `imageLicense` | Text | Licencia, si corresponde |
| `imageLicenseUrl` | Text | URL de la licencia, si corresponde |
| `sources` | Text | `[]` |

Guarda el `_id` de la respuesta para las pruebas posteriores. En el `PUT` todos los campos son opcionales; si adjuntas una imagen nueva, `imageAlt` vuelve a ser obligatorio.

## 4. Campos multipart de conciertos

Antes de crear un concierto, copia al menos un `_id` obtenido mediante `GET /songs`.

| Campo | Tipo | Ejemplo |
| --- | --- | --- |
| `city` | Text | `Test City` |
| `country` | Text | `Test Country` |
| `venue` | Text | `Test Stadium` |
| `date` | Text | `2025-01-01` |
| `tourLeg` | Text | `Test Leg` |
| `openingActs` | Text | `["Test Artist"]` |
| `showNumber` | Text | Un número libre entre 1 y 149 |
| `setlistVersion` | Text | `post-ttpd` |
| `regularSongs` | Text | `["ID_DE_UNA_CANCION"]` |
| `surprisePerformances` | Text | Ver ejemplo inferior |
| `image` | File | Imagen de prueba con uso permitido |
| `imageAlt` | Text | `Imagen de prueba del concierto` |
| `sources` | Text | `[]` |
| `notes` | Text | `Documento temporal para probar el CRUD` |

Ejemplo de `surprisePerformances` en una sola línea:

```json
[{"order":1,"instrument":"guitar","songs":["ID_DE_UNA_CANCION"],"guests":[],"notes":null}]
```

Como la semilla ya ocupa los números 1 a 149, primero borraremos el concierto 149, que no tiene una imagen de Cloudinary, y reutilizaremos ese número para el documento temporal. Tras borrar la prueba, restauraremos el concierto original con `npm run seed:concerts`. Lo haremos juntas y copiaremos previamente los identificadores necesarios.

## 5. Capturas que debemos conservar

- Respuesta `200` del estado de la API.
- Listados y filtros de ambas colecciones.
- Respuestas `201` de las dos creaciones.
- Respuestas `200` de las dos actualizaciones.
- Error `409` al intentar borrar una canción relacionada.
- Respuestas de eliminación de concierto y canción.
- Media Library de Cloudinary antes y después de sustituir y borrar archivos.
- MongoDB Atlas mostrando `songs`, `concerts`, sus cantidades y una relación.

Nunca muestres en las capturas la contraseña de Atlas, el API Secret de Cloudinary ni el contenido de `.env`.
