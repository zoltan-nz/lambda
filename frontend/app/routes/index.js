import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.createRecord('query')
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('queries', this.store.peekAll('query'));
  }
});
