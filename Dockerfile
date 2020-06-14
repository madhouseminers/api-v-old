FROM node:latest AS builder

EXPOSE 8080

WORKDIR /src

COPY . .
RUN npm install
RUN npm run build
CMD npm run start
