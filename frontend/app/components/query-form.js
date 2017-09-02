import Component from '@ember/component';

export default Component.extend({
  actions: {
    onSubmit(model) {
      this.get('onSubmit')(model);
    }
  }
});
