# UNO Challenge – Backend

Backend desarrollado con **NestJS** para el challenge Full Stack UNO.

## Tecnologías

- Node.js 22.11
- NestJS
- TypeScript
- Arquitectura por capas (inspirada en Hexagonal)
- Fetch API para obtener imágenes
- DTOs para contratos de datos

## Instalación

Clonar el repo (fork):

```bash
git clone https://github.com/illancapan/uno-test-full-stack.git
cd uno-test-full-stack/backend
```

Instalar dependencias:

```bash
npm install
```

Ejecución en modo desarrollo

```bash
npm run start:dev
```

Servidor levantado en:

```bash
http://localhost:3000
```

Endpoints
Obtener deck de cartas

```bash
http
GET /game/deck
Respuesta
```

```bash
[
  {
    "id": "0-a",
    "image": {
      "url": "https://challenge-uno.vercel.app/images/bear.jpg",
      "uuid": "d7c1b5a4-8bfa-45a4-ba9a-de92a3e81300",
      "title": "bear",
      "content_type": "image/jpeg"
    },
    "flipped": false
  }
]
```

Próximos endpoints (planeados)
POST /game/flip → cambiar estado de carta (flipped)

POST /game/match → validar pareja de cartas

Notas de arquitectura
application → casos de uso (BuildDeckService, etc.)

infrastructure → integración con APIs externas (ImageApiService)

dto → contratos de datos (CardDto, ImageDto)

game.module.ts → conecta controladores y servicios

Hexagonal: desacople backend vs servicios externos

sql
