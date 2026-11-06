# Stage 1: Build the Angular application
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g @angular/cli@17 @angular/core@17 @angular/common@17 @angular/compiler@17 @angular/platform-browser@17 \
    @angular/platform-browser-dynamic@17 @angular/router@17 --legacy-peer-deps && \
npm install --legacy-peer-deps && npm install file-saver @types/file-saver ngx-filesaver --save --legacy-peer-deps



COPY . .
RUN ng build --configuration=production

# Stage 2: Set up Nginx to serve the built application
FROM nginx:alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html/web
#COPY --from=builder /app/dist/frontend/server /usr/share/nginx/html/server

COPY nginx/conf.d/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]