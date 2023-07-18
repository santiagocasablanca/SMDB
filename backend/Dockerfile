FROM node:18.16.1-alpine3.18 as build-env

RUN mkdir -p /opt/backend

WORKDIR /opt/backend

COPY ./package.json package.json
COPY ./yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Remove devDependencies
RUN yarn install --production=true --force --frozen-lockfile

FROM node:18.16.1-alpine3.18

COPY --chown=node:node --from=build-env /opt/backend/build /opt/backend
COPY --chown=node:node --from=build-env /opt/backend/node_modules /opt/backend/node_modules
COPY --chown=node:node --from=build-env /opt/backend/package.json /opt/backend/package.json

WORKDIR /opt/backend

USER node

ENTRYPOINT [ "yarn" ]
CMD ["start:prod"]