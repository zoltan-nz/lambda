import DS from "ember-data";

export default DS.Model.extend({
  auth: DS.attr("string"),
  memory: DS.attr("number"),
  runAsync: DS.attr("string"),
  repeating: DS.attr("number"),
  max: DS.attr("number"),
  loops: DS.attr("number"),
  isValid: DS.attr("boolean"),
  validationErrors: DS.attr(),

  lambdaResponses: DS.hasMany("lambda-response", { async: false }),
  analysis: DS.belongsTo("analysis", { async: false }),

});
