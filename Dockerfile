FROM node:alpine as development

WORKDIR /usr/src/parser

COPY package.json ./

COPY npm.lock ./

RUN npm

COPY . .

RUN npm build

FROM node:alpine as production

WORKDIR /usr/src/parser

COPY package*.json .

COPY npm.lock .

RUN npm

COPY . .

COPY --from=development /usr/src/parser/dist  ./dist

CMD [ "node", "dist/main" ]