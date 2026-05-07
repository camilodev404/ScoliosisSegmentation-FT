# ScoliosisSegmentation-FT

Frontend React para consumir el microservicio `ScoliosisSegmentation-MS` y ofrecer una experiencia grafica para cargar radiografias, ejecutar inferencia y visualizar resultados de segmentacion.

Por el momento, este repositorio contiene solo la estructura base del frontend. La implementacion de pantallas, componentes y consumo real del API se agregara en siguientes iteraciones.

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

## Notas

- Framework objetivo: React.
- La estructura esta preparada para una app tipo Vite + React.
- Los archivos `.gitkeep` permiten versionar carpetas vacias mientras se implementa la interfaz.
