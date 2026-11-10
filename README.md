# SPA Demo (Node.js + Express + Docker + GitHub Actions)

## Run locally
    npm install
    npm test
    npm start            # http://localhost:3000

## Run in Docker
    docker compose up --build -d
    curl localhost:3000/health

## CI/CD setup
1. Create a GitHub repo and push this project to the `main` branch.
2. Repo Settings > Actions > General > Workflow permissions: "Read and write permissions".
3. Install a self-hosted runner on the machine that runs Docker:
   Repo Settings > Actions > Runners > New self-hosted runner (follow the commands shown), then
   start it with `./run.sh` (or install as a service with `./svc.sh install && ./svc.sh start`).
   Docker Desktop must be running.
4. Push to `main`: tests run, the image is built and pushed to ghcr.io, then the self-hosted
   runner pulls it and restarts the container on localhost:3000.

Pull requests only run the test job.

## Selenium practice
Elements carry `data-test` attributes (e.g. `[data-test='add-task']`) for locator practice.
