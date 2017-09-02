import DS from "ember-data";

export default DS.RESTSerializer.extend({

  // Backend server response:
  // resourceHash = {
  //    iteration: '0',
  //    response: {
  //      durationSeconds: 0.01234,
  //      loops: 1,
  //      max: 10000
  // }
  normalize(modelClass, resourceHash) {
    const data = {
      id: parseInt(resourceHash.iteration),
      type: modelClass.modelName,
      attributes: {
        duration: resourceHash.response.durationSeconds,
        message: resourceHash.response.message,
      },
      relationships: {
        query: {
          data: { type: 'query', id: resourceHash.query}
        }
      },
    };
    return { data };
  },
});
