# syntax=docker/dockerfile:1

FROM node:24-slim AS build
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN npm install -g pnpm@12.23.0
WORKDIR /app

# Install root (Nx/Astro/React/Tailwind) dependencies.
# --ignore-scripts skips husky + the repo's postinstall (it re-installs the app).
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# App-level dependencies live in apps/ddd-toolbox (own lockfile, gitignored).
COPY apps/ddd-toolbox/package.json apps/ddd-toolbox/
RUN cd apps/ddd-toolbox \
 && pnpm install --allow-build=esbuild --allow-build=sharp

COPY . .
RUN cd apps/ddd-toolbox && pnpm exec astro build

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/ddd-toolbox/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
