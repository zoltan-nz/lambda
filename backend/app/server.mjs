import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import _ from 'lodash';
import uuid from 'uuid/v1';
import Analysis from './analysis.mjs';
import LambdaRunner from './lambda-runner.mjs';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = { message: 'Server is ready' };
});

router.get('/query', ctx => manageQuery(ctx));
router.post('/query', ctx => manageQuery(ctx));
router.get('/queries', ctx => manageQuery(ctx));
router.post('/queries', ctx => manageQuery(ctx));

const manageQuery = async ctx => {
  let options = {};

  if (!_.isEmpty(ctx.request.body)) {
    options = ctx.request.body;
  } else {
    options = ctx.query;
  }

  if (options.query) {
    options = options.query;
  }

  const lambdaRunner = new LambdaRunner(options);

  let response = {};

  if (lambdaRunner.isValid) {

    process.stdout.write('Sending request to AWS Lambda...\n');
    process.stdout.write(`options: ${JSON.stringify(options)}\n`);

    await lambdaRunner.runQueryOnLambda();

    process.stdout.write('...done\n');
  }

  response = lambdaRunner.result;

  if (lambdaRunner.result.lambdaResponses) {
    const lambdaResponses = lambdaRunner.result.lambdaResponses;

    // Using our Analysis class for calculating some statistical data and lambda function cost
    const analysis = new Analysis(lambdaResponses, lambdaRunner.memory);

    // Add analysis to the response
    response.analysis = analysis.result;
  }

  response.id = uuid();

  ctx.body = response;
};

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .listen(PORT);

process.stdout.write(`Server is listening on port ${PORT}\n`);
