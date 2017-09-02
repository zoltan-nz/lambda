import Controller from "@ember/controller";
import config from '../config/environment';

export default Controller.extend({

  config,
  authCache: null,
  errors: [],

  actions: {

    sendQuery(query) {
      this.set('errors', []);
      this.set("authCache", query.get("auth"));

      query
        .save()
        .then((response) => {
            this.set("model", this.store.createRecord("query", {
              auth: this.get("authCache"),
              repeating: response.get("repeating"),
              memory: response.get("memory"),
              runAsync: response.get("runAsync"),
              loops: response.get("loops"),
              max: response.get("max"),
            }));
          },
        )
        .catch(error => this.set('errors', error.errors));
    },
  },
});
