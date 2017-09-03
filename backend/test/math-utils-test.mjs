import { expect } from 'chai';
import {
  average,
  avg,
  mean,
  median,
  sqrDiffs,
  stdDev,
  sum,
} from '../app/math-utils.mjs';

describe('Math utils', () => {

  it('#stdDev, #standardDeviation', () => {
    expect(stdDev([1, 2, 3])).is.equal(0.816496580927726);
    expect(stdDev([-7, 9, 19])).is.equal(10.708252269472673);
  });

  it('#sqrDiffs', () => {
    expect(sqrDiffs([1, 2, 3])).is.deep.equal([1, 0, 1]);
    expect(sqrDiffs([-7, 9, 19])).is.deep.equal([196, 4, 144]);
  });

  it('#sum', () => {
    expect(sum([1, 2, 3])).is.equal(6);
    expect(sum([-1, 2, 3])).is.equal(4);
  });

  it('#avg, #average, #mean', () => {
    expect(avg([1, 2, 3])).is.equal(2);
    expect(average([1, 2, 3])).is.equal(2);
    expect(mean([1, 2, 3])).is.equal(2);
    expect(avg([-7, 9, 19])).is.equal(7);
  });

  it('#median', () => {
    expect(median([])).is.equal(0);
    expect(median([1, 1, 1, 1, 8, 9, 9, 9])).is.equal(4.5);
    expect(median([1, 3, 9])).is.equal(3);
  });
});
