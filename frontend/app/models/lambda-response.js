import DS from 'ember-data';

export default DS.Model.extend({
  query: DS.belongsTo('query'),

  duration: DS.attr('number'),
  message: DS.attr('string')
});
