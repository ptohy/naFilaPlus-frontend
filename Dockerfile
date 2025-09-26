FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN find /usr/share/nginx/html -type f -exec chmod 644 {} \; && find /usr/share/nginx/html -type d -exec chmod 755 {} \;
EXPOSE 80
