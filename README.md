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

## Using nginx Alpine

Docker Hub link: https://hub.docker.com/_/nginx/

```
$ docker run --name some-nginx -v /some/content:/usr/share/nginx/html:ro -d nginx
$ docker run --name some-nginx -d some-content-nginx
$ docker run --name some-nginx -d -p 8080:80 some-content-nginx
```

## Lambda function

Eratosthenes function [Source](https://github.com/jconning/lambda-cpu-cost):

```python
from __future__ import print_function
from timeit import default_timer as timer

import json
import datetime

print('Loading function')  


def eratosthenes(n):
    sieve = [ True for i in range(n+1) ]
    def markOff(pv):
        for i in range(pv+pv, n+1, pv):
            sieve[i] = False
    markOff(2)
    for i in range(3, n+1):
        if sieve[i]:
            markOff(i)
    return [ i for i in range(1, n+1) if sieve[i] ]

def lambda_handler(event, context):
    start = timer()
    #print("Received event: " + json.dumps(event, indent=2))

    maxPrime = int(event['queryStringParameters']['max'])
    numLoops = int(event['queryStringParameters']['loops'])

    print("looping " + str(numLoops) + " time(s)")
    for loop in range (0, numLoops):
        primes = eratosthenes(maxPrime)
        print("Highest 3 primes: " + str(primes.pop()) + ", " + str(primes.pop()) + ", " + str(primes.pop()))

    durationSeconds = timer() - start
    return {"statusCode": 200, \
        "headers": {"Content-Type": "application/json"}, \
        "body": "{\"durationSeconds\": " + str(durationSeconds) + \
        ", \"max\": " + str(maxPrime) + ", \"loops\": " + str(numLoops) + "}"}
```

## Running backend

The backend project is placed in `./backend` folder. It is a Node.js application. The best option for running is creating a docker container. There is a Dockerfile.

```
$ cd ./backend
$ docker build -t lamdba-backend .
$ docker run -ti -p 3000:3000 lambda-backend 
```

Port `3000` is exposed.

```
$ open http://localhost:3000
```

**Backend app architecture:**

* Node.js 8.7.0 application, using the experimental module loader feature.
* Using the light Koa.js framework for accepting external requests.
* Active API endpoints: `/` (root), `/query` 

Instructions for running the backend up in development mode locally:

* Min. requirement Node.js v8.7.0

```
$ cd ./backend
$ npm install
$ npm run dev
```

LIMITATION! Unfortunately, when we would like to run our lambda function more times in one session, the backend server can time out. The `repeating` can be around 10-15 without issue if our Eratosthenes max value is 1000000. (The default timeout for a Node.js server is 120 seconds.) However, in our requirement we would like to run our experiment 100 times. For this reason the Eratosthenes max value is reduced to 10000.

##Running the experiment

* There is a script in the `./experiment` folder.
* You have to run the `backend` server first.
* The experiment script will generate the required scenarios and will call the backend server.
* The backend server will send the request to AWS Lambda.
* The experiment script accept the responses and will save in `./experiment/results` folder.

Run the experiment:

```
$ cd ./experiment
$ npm install
$ npm start
```

Default backend address is `http://localhost:3000`, you can pass a different backend address as a paramater:

```
$ npm start -- http://my.different.backend:4000
```

**Harvesting the data**

* Please note, our backend supports synchronous and asynchronous (parallel) execution. The experiment run both version.
* I realized, that the Lambda API endpoint timeout is max 30 seconds and it cannot be increased. ([More here in this AWS documentation](http://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html))
* If our lambda function run more than 30 seconds the endpoint will timeout and we cannot see the result. (We can still run our Lambda Function using the Console if we increase the timeout on the Lambda Function itself.)
* Reducing the requested maximum number in Erathostenes calculation solved this issue.

**Creating tables**

* After running the `experiment.mjs` script, results will be stored in `./experiment/results`. folder. 
* We can create a table with the `./experiment/scripts/build-table.mjs`. It reads `json` files from `results` folder and generates a table.

```
$ cd `./experiment`
$ npm run table
```

Generated table will be saved in `./experiment/tables` folder.
