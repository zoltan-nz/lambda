# NWEN 406 - Lambda Assignment

Zoltan Debre - 300360191







# Task 1

1. Implement four Lambda functions for eratosthenes with (128MB, 256MB, 512MB and 1024MB).
    
    * Document the results of running each of these functions (you can do this from the console). 
    * You only need to run each once to show that it works.
    
2. Deploy your four functions and manually test that each of them works, include evidence of this in your report.


3. Did you find that cost and performance scaled linearly with memory? Why or why not?


Eratosthenes function:

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
[Source](https://github.com/jconning/lambda-cpu-cost)

### 1. Implement four Lambda functions for eratosthenes with (128MB, 256MB, 512MB and 1024MB).

* Adding a function

![Adding a function][function-configuration]

* Setup memory usage

![Setup memory usage][function-basic-settings]

* Setup test event, query params

![Setup test event, query params][function-test-event]

* Dashboard, showing all functions

![Dashboard, all functions][functions-list]

[function-configuration]:images/function-configuration.png
[function-basic-settings]:images/function-basic-settings.png
[function-test-event]:images/function-test-event.png
[functions-list]:images/functions-list.png

#### Document the results of running each of these functions (you can do this from the console).

 
#### You only need to run each once to show that it works.

Calculation

[Price table](https://aws.amazon.com/lambda/pricing/)

128 MB - 5.68123698235s

128 MB cost: $0.000000208 / 100ms 

1024 MB - 0.620795965195s

1024 MB cost: $0.000001667 / 100ms

# Task 2

# Task 3

# Task 4


## Creating a static website container and deploying on Amazon EC2

* Dockerfile and basic app in `./hello-from-nginx` folder.
* [Documentation to AWS cli](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
* [Using EC2 tutorial](http://docs.aws.amazon.com/cli/latest/userguide/tutorial-ec2-ubuntu.html)
* [Deploying a container to EC2 tutorial](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_AWSCLI.html)

1. Launching an ECS Container Instance:

        Prefered ECS image in Sydney region: `ami-4f08e82d`


Setup authentication:

```
$ aws ecr get-login --no-include-email --region ap-southeast-2
```

```
$ 
```
