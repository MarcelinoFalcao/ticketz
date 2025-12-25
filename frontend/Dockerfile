FROM node:18-alpine as build-deps

WORKDIR /usr/src/app
COPY . .

# Variáveis necessárias para o build não quebrar
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV CI=false

RUN npm install --legacy-peer-deps
RUN npm run build

FROM ghcr.io/ticketz-oss/nginx-alpine

WORKDIR /usr/share/nginx/html

# Ajuste nos caminhos de cópia para garantir que o build seja encontrado
COPY --from=build-deps /usr/src/app/build /var/www/public
COPY --from=build-deps /usr/src/app/node_modules/@socket.io/admin-ui/ui/dist /var/www/public/socket-admin
COPY nginx /etc/nginx

# Comando para gerar o config.json e iniciar o nginx
CMD (echo "{" && while IFS='=' read -r name value; do \
        printf '\t"%s": "%s"\n' "$name" "$value"; \
    done < <(env) | sed '$!s/$/,/' && echo "}")  > /var/www/public/config.json \
    && nginx -g "daemon off;"
