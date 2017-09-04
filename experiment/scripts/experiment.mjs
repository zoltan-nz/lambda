import axios from 'axios';
import path from 'path';
import write from 'write';

const RESULT_FOLDER = path.resolve(process.cwd(), './results');

const BACKEND_SERVER = process.argv[2] || 'http://localhost:3000';

const LAMBDA_API_AUTH_TOKEN = 'some-code';

const LAMBDA_FUNCTION_REPETITION = 100;
const LAMBDA_FUNCTION_MAX = 10000;

process.stdout.write(`Start experiment.\nBackend server: ${BACKEND_SERVER}.\nResults will be saved in ${RESULT_FOLDER} folder.\n`);

const MEMORY_OPTIONS = [128, 256, 512, 1024];
const LOOPS_OPTIONS = [1, 2, 3, 4, 5];
const ASYNC_OPTIONS = [false, true];

const scenarios = [];

ASYNC_OPTIONS.forEach(runAsync => {
  MEMORY_OPTIONS.forEach(memory => {
    LOOPS_OPTIONS.forEach(loops => {
      const name = `${memory}-${loops}-${runAsync ? 'async' : 'sync'}`;
      scenarios.push(
        {
          name,
          query: {
            memory,
            runAsync,
            loops,
            max: LAMBDA_FUNCTION_MAX,
            repeating: LAMBDA_FUNCTION_REPETITION,
            auth: LAMBDA_API_AUTH_TOKEN,
          },
        },
      );
    });
  });
});

process.stdout.write(`Number of scenarios: ${scenarios.length}\n`);

scenarioRunner(scenarios);

async function scenarioRunner(scenarios) {
  process.stdout.write('Running...\n');
  let counter = 1;

  for (let scenario of scenarios) {
    process.stdout.write(`${counter}. ${scenario.name}: `);

    let result = {};
    try {
      result = await axios.get('/query', {
        baseURL: BACKEND_SERVER,
        params: scenario.query,
      });
    } catch (e) {
      if (e.code === 'ENOTFOUND' || 'ECONNREFUSED') {
        process.stderr.write(`ERROR: The backend endpoint is not available: ${BACKEND_SERVER}\n${INSTRUCTION}`);
      } else {
        process.stderr.write(`ERROR: ${e.message}\n`);
      }
      process.exit(1);
    }

    write.sync(path.resolve(RESULT_FOLDER, `${scenario.name}.json`), JSON.stringify(result.data));
    process.stdout.write('saved\n');
    counter++;
  }
}

const INSTRUCTION =
  `
   **************************************
   
   Please run the backend in an other terminal 
   before your run the experiment script.
   
   **************************************
`;
