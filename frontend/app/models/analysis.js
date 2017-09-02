import DS from 'ember-data';

export default DS.Model.extend({
  query: DS.belongsTo('query'),

  median: DS.attr('number'),
  mean: DS.attr('number'),
  stdDev: DS.attr('number'),
  sum: DS.attr('number'),
  cost: DS.attr('number')
});
