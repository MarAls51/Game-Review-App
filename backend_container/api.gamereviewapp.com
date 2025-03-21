server {
    listen 443 ssl;
    server_name api.gamereviewapp.com;

    ssl_certificate /etc/letsencrypt/live/api.gamereviewapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gamereviewapp.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'HIGH:!aNULL:!MD5';

    location / {
        proxy_pass http://gamereviewapp_backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Set-Cookie $upstream_http_set_cookie;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header 'Access-Control-Allow-Origin' 'https://gamereviewapp.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range, Set-Cookie';
        add_header 'Access-Control-Allow-Credentials' 'true';

        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
