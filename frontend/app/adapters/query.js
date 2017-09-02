import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({


  // {
  //   "options":
  //     {
  //       "repeating":1,
  //       "memory":128,
  //       "runAsync":false,
  //       "loops":1,
  //       "max":10000},
  //       "isValid":true,
  //       "validationErrors":{},
  //   "lambdaResponses":
  //         [
  //           {
  //             "iteration":"0",
  //             "response": {
  //               "durationSeconds": 0.0904541015625,
  //               "max":10000,
  //               "loops":1
  //              }
  //           }
  //         ],
  //    "analysis":
  //          {
  //            "median":0.0904541015625,
  //            "mean":0.0904541015625,
  //            "stdDev":0,
  //            "sum": 0.0904541015625,
  //            "cost":1.8814453125e-7
  //          },
  //       "id":"e6cebcd0-bc30-11e7-a544-4d647f1618ef"
  //     }
  handleResponse(status, headers, payload, requestData) {

    let analysis = payload.analysis;
    analysis.id = payload.id;
    analysis.query = payload.id;

    const lambdaResponsesIds = payload.lambdaResponses.map(lambdaResponse => parseInt(lambdaResponse.iteration));
    const lambdaResponses = payload.lambdaResponses.map(lambdaResponse => {
      let newLambdaResponse = lambdaResponse;
      newLambdaResponse.query = payload.id;
      return newLambdaResponse;
    });

    const data = {
      query: {
        id: payload.id,
        repeating: payload.options.repeating,
        memory: payload.options.memory,
        runAsync: payload.options.runAsync,
        loops: payload.options.loops,
        max: payload.options.max,
        isValid: payload.isValid,
        validationErrors: payload.validationErrors,
        analysis: analysis.id,
        lambdaResponses: lambdaResponsesIds
      },
      lambdaResponses,
      analysis
    };

    return this._super(status, headers, data, requestData);
  }
});
