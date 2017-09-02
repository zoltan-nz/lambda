import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  normalize(modelClass, resourceHash) {

    var data = {
      id:            resourceHash.id,
      type:          modelClass.modelName,
      attributes:    resourceHash
    };
    return { data: data };
  } 
});
