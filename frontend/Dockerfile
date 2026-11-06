FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Adresse publique du site (PUBLIC_SITE_URL du .env du serveur), injectée dans index.html.
# Si elle n'est pas fournie, la valeur de frontend/.env.production est utilisée.
ARG VITE_PUBLIC_SITE_URL=""
RUN if [ -n "$VITE_PUBLIC_SITE_URL" ]; then export VITE_PUBLIC_SITE_URL="${VITE_PUBLIC_SITE_URL%/}"; fi; npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

