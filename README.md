## Nodejs API Docker Sample

Nodejs / Hapi API (within a docker support).  NOTE: The server internally uses the host: 0.0.0.0 and not localhost.  

### Prerequites:
```
Node.js v10
```

### To setup:
```
npm install
```

### To run:
```
node server.js
```

### To test:
```
npm test
```

### To validate the app is running visit the urls listed below with your browser:
```
http://localhost:1337/documentation
```

### Docker commands below if you have docker or docker-compose installed:

Using your local repo:
```
docker build --force-rm=true -t nodejs-api-docker-sample:1.0.0 .
docker images
docker tag <image_id> test:latest
docker run -d --name test -p 1337:1337 nodejs-api-docker-sample:latest
docker ps
docker exec -it <container_id> /bin/ash
docker kill <container_id>
docker container ls -a
docker container rm <container_id>
docker logs <container>
docker rmi <repository>:<tag>
docker system prune -a
```

Targeting Docker hub:
```
docker login --username=<docker_user_id>
docker build --force-rm=true -t <docker_user_id>/nodejs-api-docker-sample:1.0.0 .
docker tag <image_id> <docker_user_id>/nodejs-api-docker-sample:latest
docker push <docker_user_id>/nodejs-api-docker-sample:1.0.0
docker push <docker_user_id>/nodejs-api-docker-sample:latest
docker images <docker_user_id>/nodejs-api-docker-sample
```

