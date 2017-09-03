import axios from 'axios';
import dotenv from 'dotenv';
import range from 'lodash/range';

dotenv.config();

const AWS_LAMBDA_SERVER_URL = process.env.AWS_LAMBDA_SERVER_URL;
const AWS_LAMBDA_FUNCTION_PREFIX = process.env.AWS_LAMBDA_FUNCTION_PREFIX;
const AWS_LAMBDA_API_KEY = process.env.AWS_LAMBDA_API_KEY;

const ERATOSTHENES_DEFAULT_MAX = 10000;

const VALID_MEMORY_OPTIONS = [128, 256, 512, 1024];
const VALID_LOOPS_OPTIONS = [1, 2, 3, 4, 5];
const VALID_RUN_ASYNC_OPTIONS = [true, false, 1, 0];

export default class LambdaRunner {

  /**
   * Call AWS Lambda function based on the given options.
   *
   * @param {Object} options - Options for lambda function runner
   * @param {number} options.repeating - How many times should run the lambda function?
   * @param {number} options.memory - How much memory should use for running the lambda function?
   * @param {boolean} options.runAsync - Call lambda function parallel or sequential?
   * @param {number} options.loops - How many times should repeat the Eratosthenes function?
   * @param {number} options.max - The max value in Eratosthenes function
   * @param {string} options.auth - Auth token
   */
  constructor(options) {

    this.authToken = options.auth || '';
    this.repeating = parseInt(options.repeating) || 1;
    this.memory = parseInt(options.memory) || 128;
    this.runAsync = this._convertBoolean(options.runAsync) || false;
    this.loops = parseInt(options.loops) || 1;
    this.max = parseInt(options.max) || ERATOSTHENES_DEFAULT_MAX;

    this.isValid = true;
    this.validationErrors = {};
    this.lambdaResponses = [];

    this._validate();
  }

  get result() {
    return {
      options: {
        repeating: this.repeating,
        memory: this.memory,
        runAsync: this.runAsync,
        loops: this.loops,
        max: this.max,
      },
      isValid: this.isValid,
      validationErrors: this.validationErrors,
      lambdaResponses: this.lambdaResponses,
    };
  }

  _validate() {
    if (!this._isRepeatingValid()) {
      this.validationErrors.repeating = 'Valid range: 1 - 999';
      this.isValid = false;
    }
    if (!this._isMemoryValid()) {
      this.validationErrors.memory = `Valid numbers: ${VALID_MEMORY_OPTIONS}`;
      this.isValid = false;
    }
    if (!this._isRunAsyncValid()) {
      this.validationErrors.runAsync = `Valid values: ${VALID_RUN_ASYNC_OPTIONS}`;
      this.isValid = false;
    }
    if (!this._isLoopsValid()) {
      this.validationErrors.loops = `Valid numbers: ${VALID_LOOPS_OPTIONS}`;
      this.isValid = false;
    }
    if (!this._isMaxValid()) {
      this.validationErrors.max = 'Valid range: 1 - 1000000';
      this.isValid = false;
    }
  }

  _isRepeatingValid() {
    return (this.repeating > 0) && (this.repeating < 1000);
  }

  _isMemoryValid() {
    return VALID_MEMORY_OPTIONS.includes(this.memory);
  }

  _isLoopsValid() {
    return VALID_LOOPS_OPTIONS.includes(this.loops);
  }

  _isRunAsyncValid() {
    return VALID_RUN_ASYNC_OPTIONS.includes(this.runAsync);
  }

  _isMaxValid() {
    return (this.max > 0) && (this.max < 1000001);
  }

  _lambdaFunctionQueryParams() {
    return {
      max: this.max,
      loops: this.loops,
      login: true,
    };
  }

  _convertBoolean(runAsync) {
    if (runAsync === 'false' || runAsync === false || runAsync === '0' || runAsync === 0) return false;
    if (runAsync === 'true' || runAsync === true || runAsync === '1' || runAsync === 1) return true;
    return null;
  }

  async runQueryOnLambda() {
    if (this.runAsync) {
      await this._runQueryOnLambdaASync();
    } else {
      await this._runQueryOnLambdaSync();
    }
  }

  async _runQueryOnLambdaSync() {

    process.stdout.write(`Sync started, expected iterations ${this.repeating}... `);
    const lambdaFunction = `${AWS_LAMBDA_FUNCTION_PREFIX}${this.memory}`;
    const repeat = range(this.repeating);

    let responses = [];

    for (let iteration in repeat) {

      process.stdout.write(`${iteration} `);

      let response = {};
      try {
        response = await axios.get(lambdaFunction, {
          baseURL: AWS_LAMBDA_SERVER_URL,
          params: this._lambdaFunctionQueryParams(),
          headers: {
            'x-api-key': AWS_LAMBDA_API_KEY,
            'auth': this.authToken,
          },
        });
      } catch (e) {
        response.data = e.response.data;
      }

      responses.push({
        iteration,
        response: response.data,
      });
    }

    process.stdout.write(`\nResponse: ${JSON.stringify(responses)}\n`);

    this.lambdaResponses = responses;
  }

  async _runQueryOnLambdaASync() {

    const lambdaFunction = `${AWS_LAMBDA_FUNCTION_PREFIX}${this.memory}`;
    const repeat = range(this.repeating);

    const responses = repeat.map(async iteration =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get(lambdaFunction, {
            baseURL: AWS_LAMBDA_SERVER_URL,
            params: this._lambdaFunctionQueryParams(),
            headers: {
              'x-api-key': AWS_LAMBDA_API_KEY,
              'auth': this.authToken,
            },
          });

          resolve({
            iteration,
            response: response.data,
          });

        } catch (e) {
          resolve({
            iteration,
            response: e.response.data,
          });
        }
      }));

    const results = await Promise.all(responses);

    process.stdout.write(`Response: ${JSON.stringify(results)}\n`);

    this.lambdaResponses = results;
  }
}
