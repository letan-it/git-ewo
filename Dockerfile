


## BUILD AUDIT PROJECT

FROM node:18.14-alpine AS build
WORKDIR /dist/src/app
RUN npm cache clean --force
COPY . .
RUN npm install --force
RUN npm run build --prod
FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80


# # BUILD MODUN
# FROM node:20-alpine AS builder
# WORKDIR /app
# RUN npm cache clean --force
# COPY package.json package-lock.json ./
# COPY . .
# RUN npm install --force
# RUN npm run build-proxy
# FROM nginx:alpine
# COPY --from=builder /app/dist/ /usr/share/nginx/html
# EXPOSE 80
# CMD nginx -g 'daemon off;'