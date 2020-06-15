FROM node:latest AS builder

EXPOSE 8080

WORKDIR /src

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build
CMD npm run start
