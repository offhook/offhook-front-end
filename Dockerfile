FROM node:12-alpine as builder
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80 443
CMD [ "nginx", "-g", "daemon off;" ]
