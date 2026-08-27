# The Eras Tour API REST Files

API REST dedicada a documentar los conciertos, repertorios y canciones sorpresa de *The Eras Tour* de Taylor Swift.

Proyecto de API REST Files como entrega del **MÓDULO 5: BACKEND [NODE | MONGO | API REST]** del máster **ROCK THE CODE** de **The Power Tech School**.

> **Estado del proyecto:** backend implementado. MongoDB Atlas contiene 238 canciones y los 149 conciertos de la gira, con repertorios y canciones sorpresa relacionados. Quedan las pruebas multipart finales y la recopilación de evidencias.

[English version](#english-version)

## Versión en castellano

## Descripción

The Eras Tour API REST Files será un archivo digital de los conciertos realizados durante *The Eras Tour*. La aplicación permitirá consultar las fechas, ciudades, países, recintos, etapas de la gira, repertorios habituales, canciones sorpresa, instrumentos y mashups interpretados en cada concierto.

La temática nace de una motivación personal: no pude asistir al concierto de Madrid pese a intentar comprar las entradas desde el primer día. Este proyecto es una forma de recorrer, estudiar y disfrutar *The Eras Tour* a través del aprendizaje de desarrollo backend.

## Objetivos académicos

El proyecto se desarrollará con los siguientes objetivos:

- Crear un servidor con Express.
- Conectar la aplicación con MongoDB Atlas mediante Mongoose.
- Crear dos modelos relacionados, ambos con un campo para almacenar un archivo.
- Implementar el CRUD completo de las dos colecciones.
- Crear una semilla de datos reproducible y validada.
- Subir archivos a Cloudinary desde ambas colecciones.
- Eliminar de Cloudinary los archivos que dejen de utilizarse.
- Reutilizar la configuración del almacenamiento cambiando la carpeta de destino.
- Documentar los endpoints, las decisiones técnicas, las fuentes y las pruebas.
- Aportar evidencias visuales de MongoDB Atlas, Cloudinary e Insomnia.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Cloudinary
- Multer
- dotenv
- CORS
- Insomnia

## Modelos y relaciones

La API tendrá dos colecciones principales: `Concert` y `Song`.

### Concert

Cada documento representará uno de los conciertos de la gira.

| Campo | Descripción |
| --- | --- |
| `city` | Ciudad del concierto |
| `country` | País |
| `venue` | Estadio o recinto |
| `date` | Fecha del concierto |
| `tourLeg` | Etapa geográfica de la gira |
| `openingActs` | Artistas de apertura |
| `showNumber` | Número de concierto |
| `setlistVersion` | Versión del espectáculo anterior o posterior a TTPD |
| `attendance` | Asistencia individual documentada, tipo de dato y fuente |
| `regularSongs` | Referencias a las canciones del repertorio habitual |
| `surprisePerformances` | Actuaciones sorpresa, instrumento y posibles mashups |
| `image` | URL, identificador de Cloudinary y datos de atribución |
| `sources` | Enlaces utilizados para contrastar la información |
| `notes` | Particularidades, invitados o cambios excepcionales |

### Song

Cada documento representará una canción interpretada durante la gira.

| Campo | Descripción |
| --- | --- |
| `title` | Título de la canción |
| `artist` | Artista principal o invitado |
| `album` | Álbum al que pertenece |
| `era` | Era asociada |
| `releaseYear` | Año de publicación |
| `spotifyUrl` | Búsqueda de la canción en Spotify |
| `appleMusicUrl` | Búsqueda de la canción en Apple Music |
| `amazonMusicUrl` | Búsqueda de la canción en Amazon Music |
| `image` | URL, identificador de Cloudinary y datos de atribución |
| `sources` | Referencias utilizadas para documentar los datos |

### Relación entre colecciones

Un concierto contiene numerosas canciones y una misma canción puede aparecer en muchos conciertos. La relación será de muchos a muchos mediante referencias de Mongoose:

```text
Concert.regularSongs[]                 -> Song._id
Concert.surprisePerformances[].songs[] -> Song._id
```

Las consultas de conciertos utilizarán `populate()` para devolver la información de las canciones relacionadas.

### Enlaces musicales

Cada canción incorpora búsquedas en Spotify, Apple Music y Amazon Music construidas con su título, artista y álbum. Se utiliza el mismo criterio del proyecto 6 para evitar asociar una versión incorrecta y permitir que cada plataforma muestre la grabación disponible en la región del usuario. Los mashups no reciben un enlace artificial: la respuesta del concierto contiene cada canción relacionada con sus propios enlaces.

## Repertorios y canciones sorpresa

La aplicación distinguirá entre:

- El repertorio habitual del concierto.
- La versión original del espectáculo.
- La versión modificada después de la publicación de *The Tortured Poets Department*.
- Las actuaciones sorpresa con guitarra y piano.
- Las canciones sorpresa individuales y los mashups.
- Las variaciones, colaboraciones y actuaciones excepcionales.

Las actuaciones sorpresa se representarán de forma independiente para conservar el instrumento, el orden y las canciones que formaron cada mashup.

### Asistencia

`attendance` es opcional y solo se completa cuando existe una cifra correspondiente a una noche concreta. Distingue datos comunicados (`reported`) de estimaciones (`estimated`) y siempre incluye su fuente. Los totales de varias noches y la capacidad del estadio no se reparten ni se presentan como asistencia individual. Una nueva ejecución de la semilla conserva los datos añadidos posteriormente a otros conciertos.

### Nota histórica: las fechas canceladas de Viena

Las actuaciones previstas para los días 8, 9 y 10 de agosto de 2024 en el Ernst-Happel-Stadion de Viena fueron canceladas por una amenaza de seguridad y se documentan mediante `GET /concerts/history/cancellations`. Se mantienen separadas de los 149 conciertos que sí llegaron a celebrarse.

La nota recuerda también la respuesta de la comunidad: numerosos swifties se reunieron en las calles de Viena, especialmente en Corneliusgasse, para cantar y compartir pulseras de la amistad. El campo `communityImage` permanece vacío hasta localizar una fotografía con permiso o licencia de reutilización comprobable; las fotografías editoriales encontradas no se han copiado.

## Gestión de archivos con Cloudinary

Las dos colecciones admitirán archivos subidos a Cloudinary:

- Los conciertos utilizarán la carpeta `eras-tour/concerts`.
- Las canciones utilizarán la carpeta `eras-tour/songs`.
- Se reutilizará una misma configuración de almacenamiento, recibiendo la carpeta como parámetro.
- Se guardarán tanto la URL segura como el `public_id` de Cloudinary.
- Al sustituir un archivo se eliminará el anterior cuando la actualización haya finalizado correctamente.
- Al borrar un documento se eliminará también su archivo de Cloudinary.
- Si una operación falla después de subir un archivo, se intentará retirar el archivo nuevo para evitar recursos huérfanos.

## Fuentes, imágenes y trazabilidad

La información de los conciertos se contrastará mediante fuentes públicas como la web oficial de Taylor Swift, Setlist.fm, publicaciones musicales, medios periodísticos y otras referencias especializadas.

Cada concierto podrá almacenar los enlaces consultados y la fecha de acceso. Los foros y las comunidades de seguidores podrán utilizarse para localizar información, pero los datos dudosos se contrastarán con fuentes adicionales.

Las imágenes no se descargarán ni reutilizarán solamente por estar disponibles en Internet. Se emplearán fotografías propias, recursos con una licencia compatible o imágenes cuya reutilización esté expresamente permitida. Cuando corresponda, se almacenarán y documentarán la autoría, la fuente y la licencia.

## Endpoints

URL base local: `http://localhost:5050/api`.

### Canciones

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/songs` | Obtener todas las canciones |
| GET | `/songs/:id` | Obtener una canción por su identificador |
| POST | `/songs` | Crear una canción y subir su archivo |
| PUT | `/songs/:id` | Actualizar una canción y, opcionalmente, su archivo |
| DELETE | `/songs/:id` | Eliminar una canción y su archivo de Cloudinary |

### Conciertos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/concerts` | Obtener todos los conciertos |
| GET | `/concerts/history/cancellations` | Consultar las tres fechas canceladas de Viena |
| GET | `/concerts/:id` | Obtener un concierto y sus canciones relacionadas |
| POST | `/concerts` | Crear un concierto y subir su archivo |
| PUT | `/concerts/:id` | Actualizar un concierto y, opcionalmente, su archivo |
| DELETE | `/concerts/:id` | Eliminar un concierto y su archivo de Cloudinary |

La documentación se ampliará durante el desarrollo con filtros, campos admitidos, ejemplos de peticiones, respuestas, validaciones y códigos de estado.

## Semillas y calidad de los datos

La semilla completa carga 238 canciones y los 149 conciertos de la gira:

```bash
npm run seed
```

También se pueden ejecutar por separado con `npm run seed:songs` y `npm run seed:concerts`. Primero deben cargarse las canciones porque los conciertos almacenan sus identificadores como relaciones.

La semilla utiliza operaciones `upsert`, conserva las imágenes incorporadas mediante el CRUD y puede ejecutarse repetidamente sin crear ni modificar documentos cuando los datos ya están actualizados. Antes de conectarse valida, entre otros aspectos:

- Títulos de canciones duplicados.
- Fechas y números de concierto repetidos.
- Canciones relacionadas que no existan.
- Fechas, ciudades, países o recintos incompletos.
- Diferencias entre los repertorios anteriores y posteriores a TTPD.
- Estructura de las canciones sorpresa y sus mashups.

La semilla diferencia los repertorios anteriores y posteriores a TTPD e incorpora las variaciones documentadas de determinados conciertos. Se ha comprobado ejecutándola dos veces: la segunda ejecución crea 0 documentos y actualiza 0.

## Documentación de pruebas

- Especificación OpenAPI importable en Insomnia: [`docs/openapi.yaml`](docs/openapi.yaml)
- Guía ordenada de pruebas y capturas: [`docs/INSOMNIA.md`](docs/INSOMNIA.md)
- Memoria académica y espacios para evidencias: [`docs/MEMORIA.md`](docs/MEMORIA.md)

## Documentación y evidencias

El proyecto incluirá una memoria académica con:

- Explicación de la arquitectura y las decisiones técnicas.
- Metodología y fuentes de los datos.
- Pruebas del CRUD completo en Insomnia.
- Evidencias de las colecciones y relaciones en MongoDB Atlas.
- Evidencias de las carpetas y los archivos almacenados en Cloudinary.
- Comprobaciones de sustitución y eliminación de archivos.
- Incidencias encontradas y soluciones aplicadas.

## Configuración prevista

El repositorio incluirá un archivo `.env.example` sin credenciales reales:

```env
PORT=5050
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

El archivo `.env` real contiene secretos y no debe publicarse en un repositorio público. Cuando sea necesario para la corrección, se entregará mediante el canal privado indicado por el centro y las credenciales se rotarán al finalizar.

## Aviso académico y de propiedad intelectual

He desarrollado este proyecto como ejercicio académico dentro de mi formación en Backend con Node.js, MongoDB y API REST. Soy **Araceli Fradejas Muñoz**, y he realizado este proyecto independiente y no oficial desde el cariño, el respeto y mi admiración como swiftie por Taylor Swift y *The Eras Tour*.

No mantengo ninguna afiliación con Taylor Swift, Taylor Nation, TAS Rights Management, Universal Music Group ni con ninguna entidad relacionada con la artista o la gira. Ninguna de ellas patrocina, autoriza o respalda este trabajo. Reconozco que los nombres, marcas, canciones, álbumes, imágenes y demás elementos mencionados pertenecen a sus respectivos titulares.

No persigo ningún fin comercial ni espero obtener retorno económico. Utilizo los datos exclusivamente con fines educativos y los acompaño de sus fuentes. Limito las imágenes incorporadas a material propio, recursos con licencia compatible o contenido cuya reutilización esté expresamente permitida, e incluyo la atribución correspondiente cuando es necesaria.

## Autora

**Araceli Fradejas Muñoz**

Proyecto realizado para The Power Tech School, máster Rock The Code.

### Redes sociales y enlaces

- GitHub: <https://github.com/AraceliFradejas>
- LinkedIn: <https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/>
- Instagram: <https://www.instagram.com/goldilocks1013x/>
- X (Twitter): <https://x.com/AraceliFradejas>
- TikTok: <https://www.tiktok.com/@arucci1>
- YouTube: <https://www.youtube.com/@aracelifradejasmunoz2758>
- Medium: <https://medium.com/@araceli.fradejas>

---

## English version

## Description

The Eras Tour API REST Files is planned as a digital archive of the concerts performed during Taylor Swift's *The Eras Tour*.

This API REST Files project is an assignment for **MODULE 5: BACKEND [NODE | MONGO | API REST]** of the **ROCK THE CODE** master's programme at **The Power Tech School**.

> **Project status:** backend implemented. MongoDB Atlas contains 238 songs and all 149 tour concerts, with related setlists and surprise songs. Final multipart tests and visual evidence remain to be completed.

The application will provide information about dates, cities, countries, venues, tour legs, regular setlists, surprise songs, instruments and mashups performed at each show.

The subject has a personal motivation: I was unable to attend the Madrid concert despite trying to purchase tickets from the first day. This project is a way to explore, study and enjoy *The Eras Tour* through the process of learning backend development.

## Academic goals

The project will:

- Create an Express server.
- Connect to MongoDB Atlas through Mongoose.
- Define two related models, both containing a file field.
- Implement complete CRUD operations for both collections.
- Provide a reproducible and validated data seed.
- Upload files from both collections to Cloudinary.
- Remove files from Cloudinary when they are no longer used.
- Reuse the storage configuration while changing the destination folder.
- Document endpoints, technical decisions, sources and tests.
- Include visual evidence from MongoDB Atlas, Cloudinary and Insomnia.

## Technologies

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Cloudinary
- Multer
- dotenv
- CORS
- Insomnia

## Data models and relationship

The API will contain two main collections:

- `Concert`: each document will represent a tour show, its location, date, setlist version, regular songs, surprise performances, image and sources.
- `Song`: each document will represent a song, its album, era, release year, image and sources.

The many-to-many relationship will use Mongoose references:

```text
Concert.regularSongs[]                 -> Song._id
Concert.surprisePerformances[].songs[] -> Song._id
```

Concert queries will use `populate()` to return the related song information. Surprise performances will preserve their instrument, order and the individual songs included in each mashup.

### Music links

Each song provides Spotify, Apple Music and Amazon Music searches built from its title, artist and album. This follows the same approach as project 6, avoiding an incorrect recording being assigned while allowing each service to show the version available in the user's region. Mashups do not receive an artificial link: every related song returned with the concert has its own music links.

### Attendance

`attendance` is optional and is only populated when a figure for one specific show is available. It distinguishes reported figures from estimates and always includes its source. Multi-night totals and stadium capacity are never divided or presented as individual attendance. Running the seed again preserves attendance added later to other concerts.

### Historical note: the cancelled Vienna dates

The shows scheduled for August 8, 9 and 10, 2024 at Vienna's Ernst-Happel-Stadion were cancelled because of a security threat. They are available through `GET /concerts/history/cancellations` and remain separate from the 149 concerts that were performed.

The note also records the community response: many swifties gathered in Vienna's streets, especially Corneliusgasse, to sing and exchange friendship bracelets. The `communityImage` field remains empty until a photograph with a verifiable reuse licence or permission is found; the editorial photographs located during research have not been copied.

## File management with Cloudinary

Both collections will support file uploads:

- Concert files will use the `eras-tour/concerts` folder.
- Song files will use the `eras-tour/songs` folder.
- A shared storage factory will receive the destination folder as a parameter.
- The secure URL and Cloudinary `public_id` will be stored.
- Replaced files will be removed after a successful database update.
- Deleting a document will also remove its Cloudinary file.
- If an operation fails after an upload, the newly uploaded resource will be removed whenever possible to avoid orphaned files.

## Sources, images and traceability

Concert data will be checked against public references such as Taylor Swift's official website, Setlist.fm, music publications, news reports and other specialist sources. Each concert may store the consulted URLs and access dates.

Images will not be reused merely because they are available online. The project will use original photographs, compatibly licensed resources or images whose reuse is expressly permitted. Authorship, source and licence information will be recorded whenever required.

## Endpoints

Local base URL: `http://localhost:5050/api`.

### Songs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/songs` | Retrieve all songs |
| GET | `/songs/:id` | Retrieve one song by its identifier |
| POST | `/songs` | Create a song and upload its file |
| PUT | `/songs/:id` | Update a song and optionally replace its file |
| DELETE | `/songs/:id` | Delete a song and its Cloudinary file |

### Concerts

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/concerts` | Retrieve all concerts |
| GET | `/concerts/history/cancellations` | Retrieve the three cancelled Vienna dates |
| GET | `/concerts/:id` | Retrieve a concert and its related songs |
| POST | `/concerts` | Create a concert and upload its file |
| PUT | `/concerts/:id` | Update a concert and optionally replace its file |
| DELETE | `/concerts/:id` | Delete a concert and its Cloudinary file |

The documentation will be expanded during development with filters, accepted fields, request and response examples, validation rules and HTTP status codes.

## Seeds and data quality

The complete seed loads 238 songs and all 149 tour concerts:

```bash
npm run seed
```

The seeds can also run separately with `npm run seed:songs` and `npm run seed:concerts`. Songs must be loaded first because concerts store their identifiers as relationships.

The seed uses `upsert` operations, preserves images added through the CRUD and can be repeated without duplicates. A second verified run created 0 documents and updated 0. It distinguishes the pre- and post-TTPD setlists and includes documented show variations.

## Test documentation

- OpenAPI specification for Insomnia: [`docs/openapi.yaml`](docs/openapi.yaml)
- Ordered testing and screenshot guide: [`docs/INSOMNIA.md`](docs/INSOMNIA.md)
- Academic report and evidence placeholders: [`docs/MEMORIA.md`](docs/MEMORIA.md)

## Documentation and evidence

An academic report will document the architecture, technical decisions, data sources, Insomnia CRUD tests, MongoDB Atlas collections and relationships, Cloudinary folders, file replacement and deletion, and any issues encountered during development.

## Planned configuration

The repository will provide a `.env.example` file without real credentials:

```env
PORT=5050
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

The real `.env` file contains secrets and must not be published in a public repository. If it is required for assessment, it will be provided through the private channel specified by the school and the credentials will be rotated afterwards.

## Academic and intellectual property notice

I am **Araceli Fradejas Muñoz**, and I developed this independent and unofficial academic project as part of my Backend training with Node.js, MongoDB and REST APIs. I created it with affection, respect and my admiration as a swiftie for Taylor Swift and *The Eras Tour*.

I am not affiliated with Taylor Swift, Taylor Nation, TAS Rights Management, Universal Music Group or any other entity connected with the artist or the tour. None of them sponsors, authorises or endorses this work. I acknowledge that all referenced names, trademarks, songs, albums, images and other materials belong to their respective owners.

I use this project solely for educational purposes and neither seek nor expect any financial return. I reference the data sources and limit included images to my own material, compatibly licensed resources or content whose reuse is expressly permitted, providing attribution whenever required.

## Author

**Araceli Fradejas Muñoz**

Project completed for The Power Tech School, Rock The Code master's programme.

### Social media and links

- GitHub: <https://github.com/AraceliFradejas>
- LinkedIn: <https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/>
- Instagram: <https://www.instagram.com/goldilocks1013x/>
- X (Twitter): <https://x.com/AraceliFradejas>
- TikTok: <https://www.tiktok.com/@arucci1>
- YouTube: <https://www.youtube.com/@aracelifradejasmunoz2758>
- Medium: <https://medium.com/@araceli.fradejas>
