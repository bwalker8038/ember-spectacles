import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const constraints = { video: { facingMode: 'environment' }};

    return {
      constraints
    }
  },

  actions: {
    captureImage() {
    }
  }
});
