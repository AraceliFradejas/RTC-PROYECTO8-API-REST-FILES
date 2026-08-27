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

### 4.1 Galería de archivos utilizados

Estas son las cuatro fotografías reales empleadas durante las pruebas. Se descargaron en un tamaño reducido desde Wikimedia Commons y se enviaron a Cloudinary mediante Insomnia. Sus créditos completos se conservan en [`photos/README.md`](../photos/README.md).

| folklore — Inglewood | reputation — Inglewood |
| :---: | :---: |
| ![Taylor Swift durante el set de folklore en Inglewood](../photos/eras-tour-folklore-paolo-v.jpg) | ![Taylor Swift durante el set de reputation en Inglewood](../photos/eras-tour-reputation-paolo-v.jpg) |
| Paolo V · CC BY 2.0 | Paolo V · CC BY 2.0 |

| TTPD — París | 1989 — Londres |
| :---: | :---: |
| ![Taylor Swift durante el set de TTPD en París](../photos/eras-tour-ttpd-paris-vixy13.jpg) | ![Vista del set de 1989 en Londres](../photos/eras-tour-1989-london-brigidlis.jpg) |
| Vixy13 · CC BY 4.0 | BrigidLIS · CC BY 4.0 |

Las imágenes de folklore y reputation permitieron comprobar el `POST` y el `PUT` de canciones. Las fotografías de Londres y París hicieron lo mismo para conciertos. Después se verificó que las primeras imágenes desaparecían al ser sustituidas y que las segundas se eliminaban al borrar los documentos temporales.

## 5. Pruebas y evidencias

Las pruebas se realizaron siguiendo el orden documentado en [`INSOMNIA.md`](INSOMNIA.md). Las evidencias muestran el comportamiento real de la aplicación y evitan exponer credenciales o secretos.

### 5.1 MongoDB Atlas

MongoDB Atlas contiene las colecciones `songs` y `concerts`. Las capturas verifican la conexión, los 238 documentos de canciones, los 149 conciertos y las relaciones almacenadas mediante `ObjectId`.

#### Vista general del proyecto en Atlas

![Vista general del proyecto en Atlas](../screenshots/MongoAtlas1-RTC-PROYECTO8-API-REST%20Overview.png)

#### Clúster y colecciones

![Clúster y colecciones](../screenshots/MongoAtlas2-ErasTourCluster.png)

#### Detalle de la colección de canciones

![Detalle de la colección de canciones](../screenshots/MongoAtlas3-ErasTourCluster-SongsDetail.png)

#### Detalle de un concierto y sus relaciones

![Detalle de un concierto y sus relaciones](../screenshots/MongoAtlas4-ErasTourCluster-ConcertDetail.png)

#### Concierto académico temporal

![Concierto académico temporal](../screenshots/MongoAtlas5-ErasTourCluster-TestConcert149.png)

#### Estado final: 149 conciertos y Vancouver restaurado

![Estado final: 149 conciertos y Vancouver restaurado](../screenshots/MongoAtlas6-ErasTourCluster-TestConcert149OK.png)

### 5.2 Cloudinary

Se verificó la subida de imágenes a carpetas diferentes reutilizando el mismo almacenamiento, la sustitución de archivos y la eliminación de aquellos que dejaron de estar asociados a MongoDB.

#### URL de la primera imagen de canción

![URL de la primera imagen de canción](../screenshots/Cloudinary1_urlPhoto.png)

#### Primera imagen almacenada en Cloudinary

![Primera imagen almacenada en Cloudinary](../screenshots/Cloudinary2_PhotoInCloudinaryApp.png)

#### URL obtenida tras sustituir la imagen

![URL obtenida tras sustituir la imagen](../screenshots/Cloudinary3_urlReplacePhoto.png)

#### Nueva imagen de canción en Cloudinary

![Nueva imagen de canción en Cloudinary](../screenshots/Cloudinary4_ReplacePhotoinCloudinaryApp.png)

#### Carpeta `eras-tour/songs`

![Carpeta `eras-tour/songs`](../screenshots/Cloudinary5_-CloudinaryAppSongsFolder.png)

#### Carpeta `eras-tour/concerts`

![Carpeta `eras-tour/concerts`](../screenshots/Cloudinary6_-CloudinaryAppConcertsFolder.png)

#### Detalle de la imagen inicial del concierto

![Detalle de la imagen inicial del concierto](../screenshots/Cloudinary7_-CloudinaryAppConcertsPhotoDetails.png)

#### Imagen sustituta del concierto

![Imagen sustituta del concierto](../screenshots/Cloudinary8_-CloudinaryAppConcertsNewPhotoUp.png)

#### Metadatos de la imagen sustituta

![Metadatos de la imagen sustituta](../screenshots/Cloudinary9_-CloudinaryAppConcertsNewPhotoDetails.png)

#### Imagen temporal del concierto eliminada

![Imagen temporal del concierto eliminada](../screenshots/Cloudinary10_TemporaryConcertEliminated.png)

#### Imagen temporal de la canción eliminada

![Imagen temporal de la canción eliminada](../screenshots/Cloudinary11_TemporarySongEliminated.png)

### 5.3 Insomnia

La colección importada en Insomnia permitió comprobar el estado de la API, las consultas, los filtros, los dos CRUD completos, la carga de archivos y los errores controlados.

#### API en funcionamiento

![API en funcionamiento](../screenshots/Insomnia1_TheErasTourAPI.png)

#### Filtro de canciones: `cardigan`

![Filtro de canciones: `cardigan`](../screenshots/Insomnia2-Songs-Filter-Cardigan.png)

#### Canción obtenida por identificador

![Canción obtenida por identificador](../screenshots/Insomnia3-Song-ById.png)

#### Concierto de Madrid del 29 de mayo

![Concierto de Madrid del 29 de mayo](../screenshots/Insomnia4-Concerts-Filter-Madrid29052024.png)

#### Concierto de Madrid del 30 de mayo

![Concierto de Madrid del 30 de mayo](../screenshots/Insomnia5-Concerts-Filter-Madrid30052024.png)

#### Tres fechas canceladas de Viena

![Tres fechas canceladas de Viena](../screenshots/Insomnia6-Concerts-Vienna-Cancellations.png)

#### Concierto de Madrid por identificador

![Concierto de Madrid por identificador](../screenshots/Insomnia7-Concert-ById-Madrid.png)

#### Creación de una canción con imagen

![Creación de una canción con imagen](../screenshots/Insomnia8-Song-POST-Cloudinary.png)

#### Actualización y sustitución de su imagen

![Actualización y sustitución de su imagen](../screenshots/Insomnia9-Song-PUT-Replace-Image.png)

#### Localización del concierto 149

![Localización del concierto 149](../screenshots/Insomnia10_Vancouver149.png)

#### Eliminación temporal del concierto original

![Eliminación temporal del concierto original](../screenshots/Insomnia11-Concert149-Temporary-DELETE.png)

#### Creación de un concierto con relación e imagen

![Creación de un concierto con relación e imagen](../screenshots/Insomnia12-Concert-POST-Relation-Cloudinary.png)

#### Actualización y sustitución de la imagen del concierto

![Actualización y sustitución de la imagen del concierto](../screenshots/Insomnia13-Concert-PUT-Replace-Image.png)

#### Respuesta `409` al intentar borrar una canción relacionada

![Respuesta `409` al intentar borrar una canción relacionada](../screenshots/Insomnia14-Song-DELETE-409-Related.png)

#### Eliminación del concierto académico

![Eliminación del concierto académico](../screenshots/Insomnia15_TemporaryConcertEliminated.png)

#### Eliminación posterior de la canción académica

![Eliminación posterior de la canción académica](../screenshots/Insomnia16_TemporarySongEliminated.png)

#### Concierto 149 de Vancouver restaurado

![Concierto 149 de Vancouver restaurado](../screenshots/Insomnia17-Vancouver149-RestoredOK.png)

El intento de borrar primero la canción temporal produjo un error `409 Conflict`, ya que todavía estaba relacionada con el concierto académico. Tras eliminar ese concierto, la canción pudo borrarse correctamente. De este modo se comprobó que la API protege la integridad de las relaciones.

### 5.4 Estrategia para probar el CRUD de conciertos

El modelo protege `showNumber` con un índice único y limita sus valores al intervalo 1–149, porque la gira tuvo exactamente 149 conciertos realizados. La semilla ocupa todos esos números, por lo que crear un documento temporal sin preparación produciría correctamente un conflicto de unicidad.

Para probar el `POST`, `PUT` y `DELETE` de conciertos sin relajar las reglas del modelo se siguió este procedimiento controlado:

1. Localizar mediante `GET /concerts?city=Vancouver` el concierto 149, celebrado el 8 de diciembre de 2024.
2. Confirmar que el documento no tiene una imagen asociada en Cloudinary.
3. Eliminar temporalmente únicamente ese concierto mediante su `_id`.
4. Crear un concierto académico con `showNumber: 149`, una fecha no utilizada, relaciones válidas y una imagen subida a `eras-tour/concerts`.
5. Actualizar el documento temporal y sustituir su imagen para comprobar la eliminación del recurso anterior.
6. Eliminar el concierto de prueba y verificar que su última imagen desaparece de Cloudinary.
7. Ejecutar `npm run seed:concerts` para restaurar el concierto original de Vancouver.
8. Comprobar que MongoDB Atlas vuelve a contener 149 conciertos y que una segunda ejecución de la semilla no crea ni modifica documentos.

Este procedimiento mantiene las validaciones de producción, evita números ficticios fuera del recorrido real y demuestra que la semilla permite recuperar el estado original de manera reproducible.

La restauración creó exclusivamente el documento que faltaba (`Concerts created: 1`, `Concerts updated: 0`). La ejecución quedó registrada en la [captura de la terminal](../screenshots/Terminal1-Restore-Concert149-Vancouver.png), y tanto Atlas como Insomnia confirmaron después la recuperación del concierto número 149.

## 6. Seguridad

Las credenciales permanecen en `.env`, excluido del repositorio público. Las capturas no deben mostrar la URI privada de Atlas, contraseñas ni el API Secret de Cloudinary. El archivo `.env.example` solamente documenta los nombres de las variables necesarias.

## 7. Aviso académico

Proyecto independiente, no oficial y sin finalidad comercial, realizado desde el cariño, el respeto y la admiración de una swiftie por Taylor Swift y *The Eras Tour*. Los nombres, marcas y obras citados pertenecen a sus titulares. Los datos se emplean exclusivamente con fines formativos y se acompañan de sus fuentes.
