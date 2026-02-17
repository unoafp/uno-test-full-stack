# UNO AFP CALLENGE

This project is a full stack application that allows users to play the UNO card game online. The application is built using Next.js for the frontend and Nest.js for the backend. The frontend is styled using Tailwind CSS and the backend uses a simple in-memory data store to manage game state and user information.

## Getting Started

### Prerequisites

- Node.js (v24 or later)
- Docker (for running the application in a containerized environment)
- PNPM (for managing dependencies)
- Git (for version control)


### Installation

1. Clone the repository:
   ```bash
    git clone git@github.com:ariel-rubilar/uno-test-full-stack.git
    cd uno-test-full-stack
    ```

#### Running locally

##### Frontend
```bash
    cd game-web
    pnpm install
    pnpm run dev
    
    # open http://localhost:3000 in your browser to access the frontend application.
```


#### Running with Docker

```bash
    docker compose up --build
    
    # open http://localhost:3000 in your browser to access the frontend application.
```
