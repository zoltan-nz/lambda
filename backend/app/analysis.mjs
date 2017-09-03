import { mean, median, stdDev, sum } from './math-utils.mjs';

// Source: https://aws.amazon.com/lambda/pricing/
const COST_TABLE = {
  128: 0.000000208,
  256: 0.000000417,
  512: 0.000000834,
  1024: 0.000001667,
};

export default class Analysis {

  /**
   * Analyse Lambda Response
   *
   *
   * @param lambdaResponses
   *
   * The format of the lambdaResponses. Details in LambdaRunner class.
   * [
   *    {
     *        iteration: "0",
     *        response: {
     *            durationSeconds: 7.04047179222,
     *            max: 1000000,
     *            loops: 1
     *    }
     * ]
     */

  constructor(lambdaResponses, memory) {
    this.durations = lambdaResponses.map(result => result.response.durationSeconds);
    this.memory = memory;
  }

  get median() {
    return median(this.durations);
  }

  get stdDev() {
    return stdDev(this.durations);
  }

  get mean() {
    return mean(this.durations);
  }

  get sum() {
    return sum(this.durations);
  }

  get cost() {
    const costPerSecond = COST_TABLE[this.memory] * 10;

    return this.sum * costPerSecond;
  }

  get result() {
    return {
      median: this.median,
      mean: this.mean,
      stdDev: this.stdDev,
      sum: this.sum,
      cost: this.cost,
    };
  }
}
