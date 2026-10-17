FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --chown=101:101 index.html /usr/share/nginx/html/index.html
COPY --chown=101:101 nginx.conf /etc/nginx/nginx.conf
USER 101:101
EXPOSE 8080
