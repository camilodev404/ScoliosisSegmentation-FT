# ScoliosisSegmentation-FT

## Grupo 18

Autores de la solucion:

- Cristian Camilo Nino Rincon
- Integrante pendiente 2
- Integrante pendiente 3
- Integrante pendiente 4

## Proposito

Frontend React para la experiencia de usuario de **Segmentacion de Vertebras**. La aplicacion consume el microservicio `ScoliosisSegmentation-MS` y permite cargar una radiografia de columna, consultar el estado del backend, ejecutar inferencia y visualizar la respuesta del modelo.

Este repositorio corresponde a la capa de interfaz grafica del proyecto. La investigacion, entrenamiento y notebooks viven en `ScoliosisSegmentation`; el API de inferencia vive en `ScoliosisSegmentation-MS`.

## Experiencia Implementada

- Panel de estado del microservicio.
- Verificacion de disponibilidad de modelos.
- Carga de imagen por selector o drag and drop.
- Vista previa local de la radiografia.
- Envio de la imagen al endpoint `POST /api/v1/predict`.
- Visualizacion de respuesta: ID de prediccion, dimensiones, etiquetas detectadas, ruta de mascara y ruta de preview.
- Manejo de errores `400` y `503`, incluyendo lista de modelos faltantes.

## Flujo de Uso

```text
Usuario
  -> carga radiografia
  -> revisa vista previa
  -> ejecuta inferencia
  -> frontend envia imagen al microservicio
  -> microservicio responde con resultado del modelo
  -> frontend muestra etiquetas detectadas, mascara final y vista previa
```

## Estructura del Repositorio

```text
ScoliosisSegmentation-FT/
├── public/                   # Archivos publicos estaticos.
├── src/
│   ├── assets/               # Imagenes, iconos y recursos visuales.
│   ├── components/           # Componentes reutilizables de UI.
│   ├── features/
│   │   └── inference/        # Modulo de carga, inferencia y resultados.
│   ├── hooks/                # Hooks reutilizables de React.
│   ├── layouts/              # Layouts principales de la aplicacion.
│   ├── pages/                # Vistas o paginas de la experiencia.
│   ├── services/             # Cliente HTTP para consumir el microservicio.
│   ├── styles/               # Estilos globales y tokens visuales.
│   ├── types/                # Tipos compartidos de TypeScript.
│   └── utils/                # Utilidades del frontend.
├── tests/                    # Pruebas del frontend.
└── docs/                     # Documentacion de UX y decisiones de interfaz.
```

## Microservicio Consumido

El frontend consume los endpoints del repositorio `ScoliosisSegmentation-MS`:

```text
GET  /api/v1/health
POST /api/v1/predict
```

`GET /api/v1/health` se usa para saber si el backend esta disponible y si los modelos estan listos.

`POST /api/v1/predict` recibe la radiografia y devuelve la respuesta de inferencia.

## Configuracion

Crear un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Variable disponible:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Ejecucion Local

Instalar dependencias:

```bash
npm install
```

Levantar el frontend:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://127.0.0.1:5173
```

Para que la inferencia funcione, el microservicio debe estar corriendo en otra terminal:

```bash
cd ../ScoliosisSegmentation-MS
uvicorn app.main:app --reload
```

## Ejecucion con Docker Compose

El proyecto completo se puede levantar desde la carpeta padre `PROYECTO_SCOLIOSIS`, donde esta el archivo `docker-compose.yml`.

```bash
cd /Users/camilo/Documents/WorkSpace/IA-MASTER/PROYECTO_SCOLIOSIS
docker compose up --build
```

Servicios expuestos:

```text
Frontend: http://127.0.0.1:5173
API:      http://127.0.0.1:8000/api/v1/health
Docs API: http://127.0.0.1:8000/docs
```

Para detener todo:

```bash
docker compose down
```

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de produccion
npm run preview  # previsualizar build
npm run lint     # revision estatica
```

## Tecnologia

- React
- Vite
- TypeScript
- Lucide React para iconografia
- CSS modularizado en `src/styles/global.css`
