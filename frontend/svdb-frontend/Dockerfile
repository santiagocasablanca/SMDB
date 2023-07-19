FROM node:18.16.1-alpine3.18 as build-env

RUN apk update && apk add --no-cache \
    curl bash python3 make g++

RUN mkdir -p /opt/frontend

WORKDIR /opt/frontend

COPY ./package.json package.json
COPY ./yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:1.17.9-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build-env /opt/frontend/build ./

EXPOSE 80