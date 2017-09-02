import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  messages: computed.mapBy('model.lambdaResponses', 'message'),

  ids: computed.mapBy('model.lambdaResponses', 'id'),
  durations: computed.mapBy('model.lambdaResponses', 'duration').readOnly(),

  graphData: computed('ids', 'durations', function() {
    return {
      labels: this.get('ids'),
      datasets: [
        {
          label: 'duration',
          data: this.get('durations')
        }
      ]
    }
  })
});
