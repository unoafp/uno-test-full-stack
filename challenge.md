# Full Stack Technical Challenge  
## Memory / Concentration Game

Bienvenido/a al desafío técnico Full Stack.

Este repositorio corresponde al **punto de partida oficial** del challenge.  
Para comenzar, debes **hacer un fork de este repositorio** y trabajar únicamente sobre tu fork.

## Objetivo del Desafío

Construir una aplicación **Full Stack** que implemente el juego de cartas **Concentration / Memory**, con foco en:

- Calidad y estructura de código
- Separación Frontend / Backend
- Persistencia de datos
- Pruebas unitarias
- Dockerización
- Uso profesional de GitHub (ramas, PRs, CI)

El Backend debe **persistir los resultados finales del juego**, permitiendo consultar un **historial de victorias por RUN**.

## Cómo comenzar

1. Haz **fork** de este repositorio en tu cuenta de GitHub.
2. Clona **tu fork** localmente.
3. A partir de ese punto, todo el desarrollo debe realizarse en tu repositorio.

> ⚠️ No se aceptarán PRs ni commits directos sobre este repositorio original.

## Alcance Funcional (Resumen)

### Identificación de Usuario
- Solicitar nombre y RUN en el primer ingreso.
- Persistir identidad para evitar duplicidad de RUN.
- El usuario no debe volver a ingresar sus datos al refrescar.

### Juego
- Juego de memoria clásico.
- Máximo 2 cartas volteadas por turno.
- Contadores de errores y aciertos.
- Mensaje de finalización con el nombre del usuario.

### Persistencia de Resultados
- Guardar el resultado final al completar el juego.
- Consultar victorias pasadas por RUN.

## Arquitectura Esperada

### Frontend
- React o Next.js
- TypeScript preferido
- Tailwind CSS o Ant Design

### Backend
- NestJS (recomendado) o Express con TypeScript
- Construye el deck (duplica y mezcla imágenes)
- Persiste usuarios y resultados
- Expone APIs para historial por RUN

## API Externa de Imágenes

Las imágenes deben obtenerse desde:

```
GET https://challenge-uno.vercel.app/api/images
```

El backend es responsable de:
- Seleccionar imágenes
- Duplicarlas
- Mezclarlas (shuffle)

## Testing (Obligatorio)

### Frontend
- Jest + React Testing Library o Vitest
- Lógica del juego
- Actualización de métricas
- Finalización
- Render de historial

### Backend
- Jest
- Construcción del deck
- Validaciones
- Persistencia y consultas

## Dockerización (Obligatorio)

El proyecto debe levantarse con `docker compose`

Requisitos:
- Dockerfile para Frontend
- Dockerfile para Backend
- docker-compose.yml en la raíz
- Base de datos incluida si aplica

## Flujo de GitHub (Obligatorio)

### Ramas
- `main` (sin commits directos)
- Ramas de feature, por ejemplo:
  - feature/frontend-game
  - feature/backend-results
  - feature/docker-setup

### Pull Requests
- Mínimo **3 Pull Requests**
- Cada PR debe incluir:
  - Descripción clara del cambio
  - Motivación técnica
  - Checklist de calidad

### Commits
- Mensajes en inglés
- Commits pequeños y coherentes
- Se recomienda Conventional Commits

### CI
- GitHub Actions ejecutando:
  - Lint
  - Tests
- Debe correr en cada PR

## Documentación Esperada

El README.md de tu fork debe incluir:
- Descripción del proyecto
- Decisiones de arquitectura
- Instrucciones para ejecutar localmente
- Instrucciones para ejecutar con Docker
- Instrucciones para ejecutar tests
- Flujo de trabajo en GitHub
- Propuesta de diseño de interfaz

## Entregable

- Repositorio público (tu fork)
- Código funcional
- Pruebas ejecutables
- Docker operativo
- README completo

No se aceptan:
- Archivos comprimidos
- Capturas de pantalla como reemplazo del código
- Commits directos en este repositorio base

## Consideraciones Finales

- Todo el código debe estar en **inglés**
- Se valora claridad, simplicidad y criterio técnico
- No se espera perfección visual, sí solidez técnica

Éxito en el desafío.
