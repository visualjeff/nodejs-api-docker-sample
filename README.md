## Nodejs API Docker Sample

Nodejs / Hapi API (with docker and docker-compose support).  NOTE: The server internally uses the host: 0.0.0.0 and not localhost.  Data is persisted to a file named loki.js.  All endpoints exposed are documented using swagger document and can be exercised at http://localhost:1337/documentation.  

### Prerequites:
```
Nodejs v10.6.x or newer.  LTS support is recommended.  Nodejs can be installed using NVM (node version manager).

nvm can be found at: https://github.com/nvm-sh/nvm
```

### To setup:
```
npm install
```

### To run:
```
node server.js
```

### To run unit tests:
```
npm test
```

### To validate the application is running and view the swagger document (describing the endpoings) visit the url listed below with your browser:
```
http://localhost:1337/documentation
```

### Docker commands below if you have docker or docker-compose installed:

### Prerequites:
```
Docker can be found at: https://docs.docker.com/install/
Docker-compose can be found at: https://docs.docker.com/compose/install/
```

Using docker:
```
docker build --force-rm=true -t nodejs-api-docker-sample:1.0.0 .
docker images
docker tag <image_id> nodejs-api-docker-sample:latest
docker run -d --name nodejs-api-docker-sample -p 1337:1337 nodejs-api-docker-sample:latest
docker ps
docker exec -it <container_id> /bin/ash
docker kill <container_id>
docker container ls -a
docker container rm <container_id>
docker logs <container>
docker rmi <repository>:<tag>
docker system prune -a
```

Using docker-compose:
```
docker-compose build
docker-compose up -d
docker-compose logs -f
docker-compose exec nodejs-api-docker-sample sh
docker-compose stop
```

Targeting the public Docker hub for your image repo:
```
docker login --username=<docker_user_id>
docker build --force-rm=true -t <docker_user_id>/nodejs-api-docker-sample:1.0.0 .
docker tag <image_id> <docker_user_id>/nodejs-api-docker-sample:latest
docker push <docker_user_id>/nodejs-api-docker-sample:1.0.0
docker push <docker_user_id>/nodejs-api-docker-sample:latest
docker images <docker_user_id>/nodejs-api-docker-sample
```

