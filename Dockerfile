FROM node:12 AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM alpine:3.14
COPY --from=0 /app/public /client