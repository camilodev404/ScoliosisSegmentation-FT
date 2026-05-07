# ScoliosisSegmentation-FT

Frontend React para consumir el microservicio `ScoliosisSegmentation-MS` y ofrecer una experiencia grafica para cargar radiografias, ejecutar inferencia y visualizar resultados de segmentacion.

La aplicacion permite seleccionar o arrastrar una radiografia de columna, consultar el estado del microservicio, enviar la imagen a `POST /api/v1/predict` y visualizar la respuesta devuelta por el backend.

## Estructura Base

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

Este frontend consumira principalmente:

```text
GET  /api/v1/health
POST /api/v1/predict
```

del repositorio `ScoliosisSegmentation-MS`.

## Experiencia Implementada

- Panel de estado del microservicio.
- Verificacion de disponibilidad de modelos.
- Carga de imagen por selector o drag and drop.
- Vista previa local de la radiografia.
- Envio de la imagen al endpoint `POST /api/v1/predict`.
- Visualizacion de respuesta: ID de prediccion, dimensiones, etiquetas, rutas de mascara y preview.
- Manejo de errores `400` y `503`, incluyendo lista de modelos faltantes.

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

Para que la inferencia funcione, el microservicio debe estar corriendo:

```bash
cd ../ScoliosisSegmentation-MS
uvicorn app.main:app --reload
```

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de produccion
npm run preview  # previsualizar build
npm run lint     # revision estatica
```

## Notas

- Framework: React + Vite + TypeScript.
- Iconografia: `lucide-react`.
- Los archivos `.gitkeep` permiten versionar carpetas vacias mientras crece la interfaz.
