FROM node:20 AS build-stage
WORKDIR /app

COPY . .

RUN npm ci
RUN npm run test
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html