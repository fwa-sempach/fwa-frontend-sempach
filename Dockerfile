# base image
FROM node:12.10.0-alpine as build

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2
FROM nginx:1.17.3-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf