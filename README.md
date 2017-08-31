AWS, Lambda, Docker
===================

# Creating static website docker image

* https://github.com/smebberson/docker-alpine/tree/master/alpine-nginx

## Setup Alpine Linux


Launching basic Alpine:

```
$ docker get alpine
$ docker run -ti alpine /bin/sh
```

Update Alpine:

```
$ apk update
$ apk upgrade
$ rm -rf /var/cache/apk/*
```

Alpine Docker image documentation:

* http://gliderlabs.viewdocs.io/docker-alpine/

Two options for installing packages:

* Using `apk update`, `apk upgrade` with `rm -rf /var/cache/apk/*`, or
* using `apk --no-cache add ...` option.

## Using Nginx Alpine

Docker Hub link: https://hub.docker.com/_/nginx/

```
$ docker run --name some-nginx -v /some/content:/usr/share/nginx/html:ro -d nginx
$ docker run --name some-nginx -d some-content-nginx
$ docker run --name some-nginx -d -p 8080:80 some-content-nginx
```